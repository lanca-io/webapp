import type { ExtendedToken } from '../tokens/types'
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import { StoreApi } from 'zustand'

export type BalancesState = {
	balances: ExtendedToken[]
	isLoadingBalances: boolean
	setBalances: (tokens: ExtendedToken[]) => void
	setLoadingBalances: (isLoading: boolean) => void
	filterTokensByChain: (chainId: string) => ExtendedToken[]
}

export type BalancesStore = UseBoundStoreWithEqualityFn<StoreApi<BalancesState>>
