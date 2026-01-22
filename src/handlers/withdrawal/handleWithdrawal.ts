import type { Client, Chain, Address } from 'viem'
import { getMinWithdrawal } from './getMinWithdrawal'
import { queueWithdrawal } from './queueWithdrawal'
import { handleAllowance } from '../allowance'
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
	chain: Chain,
	token: Address,
	account: Address,
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
		await handleAllowance(client, chain, token, account, amount)
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.ALLOWANCE,
				status: PoolsActionStatus.SUCCESS,
			},
		})
	} catch (e) {
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
					stage: PoolsActionStages.ALLOWANCE,
					status: PoolsActionStatus.FAILED,
				},
			})
			throw new Error(`Min withdrawal ${minWithdraw}`)
		}
	} catch (e) {
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

const onQueueWithdrawal = async (
	client: Client,
	chain: Chain,
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
		await queueWithdrawal(client, chain, pool, amount)
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.QUEUE,
				status: PoolsActionStatus.SUCCESS,
			},
		})
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

export const handleWithdrawal = async (
	client: Client,
	chain: Chain,
	pool: Address,
	token: Address,
	amount: bigint,
	dispatch: DispatchWithdrawalAction,
): Promise<boolean> => {
	if (!client.account) throw new Error('[Lanca]: No account')

	await onAllowance(
		client,
		chain,
		token,
		client.account.address,
		amount,
		dispatch,
	)
	await onMinWithdrawalCheck(client, pool, amount, dispatch)
	await onQueueWithdrawal(client, chain, pool, amount, dispatch)

	return true
}
