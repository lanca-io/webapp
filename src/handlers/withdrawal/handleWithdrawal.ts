import type { Client, Address } from 'viem'
import { getMinWithdrawal } from './getMinWithdrawal'
import { queueWithdrawal } from './queueWithdrawal'
import { handleAllowance } from '../allowance'
import {
	UserRejectedRequestError,
	ContractFunctionExecutionError,
	TransactionExecutionError,
} from 'viem'
import {
	PoolsActionStages,
	PoolsActionStatus,
	PoolsStateActions,
} from '@/components/common/PoolActionModal/Reducer/types'

export type DispatchWithdrawalAction = React.Dispatch<{
	type: PoolsStateActions.UPDATE_STEP
	payload: { stage: PoolsActionStages; status: PoolsActionStatus }
}>

const onAllowance = async (
	client: Client,
	chainId: number,
	token: Address,
	address: Address,
	amount: bigint,
	dispatch: DispatchWithdrawalAction,
): Promise<void> => {
	try {
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.ALLOWANCE,
				status: PoolsActionStatus.PENDING,
			},
		})
		await handleAllowance(client, chainId, token, address, amount)
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.ALLOWANCE,
				status: PoolsActionStatus.SUCCESS,
			},
		})
	} catch (e) {
		if (
			e instanceof UserRejectedRequestError ||
			(e instanceof ContractFunctionExecutionError &&
				e.message.includes('rejected')) ||
			(e instanceof TransactionExecutionError && e.message.includes('rejected'))
		) {
			dispatch({
				type: PoolsStateActions.UPDATE_STEP,
				payload: {
					stage: PoolsActionStages.ALLOWANCE,
					status: PoolsActionStatus.REJECTED,
				},
			})

			throw e
		}
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.ALLOWANCE,
				status: PoolsActionStatus.FAILED,
			},
		})
		throw e
	}
}

const onMinWithdrawalCheck = async (
	client: Client,
	pool: Address,
	amount: bigint,
	dispatch: DispatchWithdrawalAction,
): Promise<void> => {
	try {
		const minWithdraw = await getMinWithdrawal(client, pool)
		if (amount < minWithdraw) {
			dispatch({
				type: PoolsStateActions.UPDATE_STEP,
				payload: {
					stage: PoolsActionStages.QUEUE,
					status: PoolsActionStatus.FAILED,
				},
			})
			throw new Error(`Min withdrawal ${minWithdraw}`)
		}
	} catch (e) {
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.QUEUE,
				status: PoolsActionStatus.FAILED,
			},
		})
		throw e
	}
}

const onQueueWithdrawal = async (
	client: Client,
	chainId: number,
	pool: Address,
	amount: bigint,
	dispatch: DispatchWithdrawalAction,
): Promise<void> => {
	try {
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.QUEUE,
				status: PoolsActionStatus.PENDING,
			},
		})
		await queueWithdrawal(client, chainId, pool, amount)
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.QUEUE,
				status: PoolsActionStatus.SUCCESS,
			},
		})
	} catch (e) {
		if (
			e instanceof UserRejectedRequestError ||
			(e instanceof ContractFunctionExecutionError &&
				e.message.includes('rejected')) ||
			(e instanceof TransactionExecutionError && e.message.includes('rejected'))
		) {
			dispatch({
				type: PoolsStateActions.UPDATE_STEP,
				payload: {
					stage: PoolsActionStages.QUEUE,
					status: PoolsActionStatus.REJECTED,
				},
			})

			throw e
		}
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.QUEUE,
				status: PoolsActionStatus.FAILED,
			},
		})
		throw e
	}
}

export const handleWithdrawal = async (
	client: Client,
	chainId: number,
	pool: Address,
	token: Address,
	amount: bigint,
	dispatch: DispatchWithdrawalAction,
): Promise<boolean> => {
	if (!client.account) throw new Error('[Lanca]: No account')

	await onAllowance(client, chainId, token, pool, amount, dispatch)
	await onMinWithdrawalCheck(client, pool, amount, dispatch)
	await onQueueWithdrawal(client, chainId, pool, amount, dispatch)

	return true
}
