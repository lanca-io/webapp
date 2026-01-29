import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand/vanilla'
import { PoolsActionType } from '@/components/common/PoolActionModal/Reducer/types'

export enum PoolActionStatus {
	Queued = 'queued',
	Processed = 'processed',
	Completed = 'completed',
	Failed = 'failed',
}

export type PoolAction = {
	address: string | null
	amount: string | null
	lp_amount: string | null
	processed_amount: string | null
	processed_lp_amount: string | null
	withdrawn_amount: string | null
	tx_hash: string | null
	created_at: number | null
	completed_at: number | null
	type: PoolsActionType
	status: PoolActionStatus
}

export type PoolsPositionsState = {
	rawUsd: bigint | null
	rawLp: bigint | null
	usd: number | null
	lp: number | null
	areBalancesLoading: boolean
	actions: PoolAction[]
	areActionsLoading: boolean
}

export type PoolsPositionsActions = {
	setBalances: (rawUsd: bigint, rawLp: bigint) => void
	setBalancesLoading: (loading: boolean) => void
	setActions: (actions: PoolAction[]) => void
	setActionsLoading: (loading: boolean) => void
	clearActions: () => void
}

export type PoolsPositionsStateAndActions = PoolsPositionsState &
	PoolsPositionsActions

export type PoolsPositionsStore = UseBoundStoreWithEqualityFn<
	StoreApi<PoolsPositionsStateAndActions>
>
