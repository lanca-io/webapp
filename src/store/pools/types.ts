import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand/vanilla'

type PoolsUserState = {
	balance: bigint | null
	usdBalance: bigint | null
	principal: bigint | null
}

type PoolsInfoState = {
	supply: bigint | null
	cap: bigint | null
	tvl: bigint | null
}

type PoolsLoadingState = {
	isSupplyLoading: boolean
	isCapLoading: boolean
	isTvlLoading: boolean
	isBalanceLoading: boolean
}

export type PoolsActions = {
	setSupply: (supply: bigint) => void
	setCap: (cap: bigint) => void
	setTvl: (tvl: bigint) => void
	setBalance: (balance: bigint) => void
	setPrincipal: (principal: bigint) => void
	setIsSupplyLoading: (isLoading: boolean) => void
	setIsCapLoading: (isLoading: boolean) => void
	setIsTvlLoading: (isLoading: boolean) => void
	setIsBalanceLoading: (isLoading: boolean) => void
}

export type PoolsState = PoolsUserState & PoolsInfoState & PoolsLoadingState

export type PoolsStore = UseBoundStoreWithEqualityFn<
	StoreApi<PoolsState & PoolsActions>
>
