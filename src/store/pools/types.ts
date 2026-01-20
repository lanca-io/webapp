import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand/vanilla'

export type PoolsState = {
	supply: number | null
	cap: number | null
	tvl: number | null
	lpPrice: number | null
	isLoading: boolean
}

export type PoolsActions = {
	setMetics: (supply: number, cap: number, tvl: number) => void
	setIsLoading: (isLoading: boolean) => void
}

export type PoolsStore = UseBoundStoreWithEqualityFn<
	StoreApi<PoolsState & PoolsActions>
>
