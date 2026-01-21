import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand/vanilla'

export type PoolsDataState = {
	supply: number | null
	cap: number | null
	tvl: number | null
	lpPrice: number | null
	isLoading: boolean
}

export type PoolsDataActions = {
	setMetics: (supply: number, cap: number, tvl: number) => void
	setIsLoading: (isLoading: boolean) => void
}

export type PoolsStore = UseBoundStoreWithEqualityFn<
	StoreApi<PoolsDataState & PoolsDataActions>
>
