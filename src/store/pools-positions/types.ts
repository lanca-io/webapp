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

export type PoolActionPagination = {
	take: number
	skip: number
}

export type PoolActionsStateSlice = {
	actions: PoolAction[]
	initialActionsLoading: boolean
	dataActionsLoading: boolean
	actionsPagination: PoolActionPagination
}

export type BalancesStateSlice = {
	rawUsd: bigint | null
	rawLp: bigint | null
	usd: number | null
	lp: number | null
	balancesLoading: boolean
}

export type PoolsPositionsActions = {
	setBalances: (rawUsd: bigint, rawLp: bigint) => void
	setBalancesLoading: (loading: boolean) => void
	setActions: (actions: PoolAction[]) => void
	addActions: (actions: PoolAction[]) => void
	setActionsLoading: (loading: boolean, initial?: boolean) => void
	setActionsPagination: (pagination: PoolActionPagination) => void
	resetActions: () => void
}

export type PoolsPositionsState = BalancesStateSlice &
	PoolActionsStateSlice &
	PoolsPositionsActions

export type PoolsPositionsStateAndActions = PoolsPositionsState

export type PoolsPositionsStore = UseBoundStoreWithEqualityFn<
	StoreApi<PoolsPositionsState>
>
