import type { Client, Chain, Address } from 'viem'
import { handleAllowance } from '../allowance'
import { getMinDeposit } from './getMinDeposit'
import { queueDeposit } from './queueDeposit'
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
	chain: Chain,
	token: Address,
	account: Address,
	amount: bigint,
	dispatch: DispatchDepositAction,
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
					stage: PoolsActionStages.ALLOWANCE,
					status: PoolsActionStatus.FAILED,
				},
			})
			throw new Error(`Min deposit ${minDeposit}`)
		}
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

const onQueue = async (
	client: Client,
	chain: Chain,
	pool: Address,
	amount: bigint,
	dispatch: DispatchDepositAction,
): Promise<void> => {
	try {
		dispatch({
			type: PoolsStateActions.UPDATE_STEP,
			payload: {
				stage: PoolsActionStages.QUEUE,
				status: PoolsActionStatus.PENDING,
			},
		})
		await queueDeposit(client, chain, pool, amount)
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

export const handleDeposit = async (
	client: Client,
	chain: Chain,
	pool: Address,
	token: Address,
	amount: bigint,
	dispatch: DispatchDepositAction,
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
	await onMinDepositCheck(client, pool, amount, dispatch)
	await onQueue(client, chain, pool, amount, dispatch)

	return true
}
