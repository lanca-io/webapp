import type { ExtendedToken } from '../tokens/types'
import { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import { StoreApi } from 'zustand'

export type BalancesState = {
	srcBalances: ExtendedToken[]
	dstBalances: ExtendedToken[]
	isLoadingSrcBalances: boolean
	isLoadingDstBalances: boolean
	setSrcBalances: (balances: ExtendedToken[]) => void
	setDstBalances: (balances: ExtendedToken[]) => void
	clearSrcBalances: () => void
	clearDstBalances: () => void
	setLoadingSrcBalances: (isLoading: boolean) => void
	setLoadingDstBalances: (isLoading: boolean) => void
}

export type BalancesStore = UseBoundStoreWithEqualityFn<StoreApi<BalancesState>>
