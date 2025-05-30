import type { ExtendedToken } from '../tokens/types'
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import { StoreApi } from 'zustand'

export type BalancesStateSlice = {
	balances: ExtendedToken[]
	isLoading: boolean
}

export type BalancesActions = {
	setBalances: (tokens: ExtendedToken[]) => void
	setIsLoading: (isLoading: boolean) => void
}

export type BalancesSelectors = {
	getBalancesByChainId: (chainId: string) => ExtendedToken[]
}

export type BalancesState = BalancesStateSlice & BalancesActions & BalancesSelectors
export type BalancesStore = UseBoundStoreWithEqualityFn<StoreApi<BalancesState>>
