import type { Client, Address } from 'viem'
import { handleAllowance } from '../allowance'
import { getMinDeposit } from './getMinDeposit'
import { queueDeposit } from './queueDeposit'
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

export type DispatchDepositAction = React.Dispatch<{
	type: PoolsStateActions.UPDATE_STEP
	payload: { stage: PoolsActionStages; status: PoolsActionStatus }
}>

const onAllowance = async (
	client: Client,
	chainId: number,
	token: Address,
	address: Address,
	amount: bigint,
	dispatch: DispatchDepositAction,
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

const onMinDepositCheck = async (
	client: Client,
	pool: Address,
	amount: bigint,
	dispatch: DispatchDepositAction,
): Promise<void> => {
	try {
		const minDeposit = await getMinDeposit(client, pool)
		if (amount < minDeposit) {
			dispatch({
				type: PoolsStateActions.UPDATE_STEP,
				payload: {
					stage: PoolsActionStages.Queue,
					status: PoolsActionStatus.Failed,
				},
			})
			throw new Error(`Min deposit ${minDeposit}`)
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

const onQueue = async (
	client: Client,
	chainId: number,
	pool: Address,
	amount: bigint,
	dispatch: DispatchDepositAction,
): Promise<void> => {
	try {
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.Queue,
				status: PoolsActionStatus.Pending,
			},
		})
		await queueDeposit(client, chainId, pool, amount)
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

export const handleDeposit = async (
	client: Client,
	chainId: number,
	pool: Address,
	token: Address,
	amount: bigint,
	dispatch: DispatchDepositAction,
): Promise<boolean> => {
	if (!client.account) throw new Error('[Lanca]: No account')

	await onAllowance(client, chainId, token, pool, amount, dispatch)
	await onMinDepositCheck(client, pool, amount, dispatch)
	await onQueue(client, chainId, pool, amount, dispatch)

	return true
}
