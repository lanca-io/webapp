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
				stage: PoolsActionStages.Allowance,
				status: PoolsActionStatus.Pending,
			},
		})
		await handleAllowance(client, chainId, token, address, amount)
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.Allowance,
				status: PoolsActionStatus.Success,
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
					stage: PoolsActionStages.Allowance,
					status: PoolsActionStatus.Rejected,
				},
			})

			throw e
		}
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.Allowance,
				status: PoolsActionStatus.Failed,
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
					stage: PoolsActionStages.Queue,
					status: PoolsActionStatus.Failed,
				},
			})
			throw new Error(`Min withdrawal ${minWithdraw}`)
		}
	} catch (e) {
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.Queue,
				status: PoolsActionStatus.Failed,
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
				stage: PoolsActionStages.Queue,
				status: PoolsActionStatus.Pending,
			},
		})
		await queueWithdrawal(client, chainId, pool, amount)
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.Queue,
				status: PoolsActionStatus.Success,
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
					stage: PoolsActionStages.Queue,
					status: PoolsActionStatus.Rejected,
				},
			})

			throw e
		}
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.Queue,
				status: PoolsActionStatus.Failed,
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
