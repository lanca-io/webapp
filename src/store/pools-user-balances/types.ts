import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand/vanilla'

export type PoolsUserBalanceState = {
	rawUsd: bigint | null
	rawLp: bigint | null
	usd: number | null
	lp: number | null
	isLoading: boolean
}

export type PoolsUserBalanceActions = {
	setBalances: (rawUsd: bigint, rawLp: bigint) => void
	setIsLoading: (isLoading: boolean) => void
}

export type PoolsUserBalanceStateAndActions = PoolsUserBalanceState &
	PoolsUserBalanceActions

export type PoolsUserBalanceStore = UseBoundStoreWithEqualityFn<
	StoreApi<PoolsUserBalanceStateAndActions>
>
