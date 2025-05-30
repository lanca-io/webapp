import type { ILancaChain } from '@lanca/sdk'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'

export type ChainsStateSlice = {
	chains: ILancaChain[]
	isLoading: boolean
}

export type ChainsActions = {
	setChains: (chains: ILancaChain[]) => void
	clearChains: () => void
	setLoading: (isLoading: boolean) => void
}

export type ChainsSelectors = {
	getChainById: (id: string) => ILancaChain | undefined
}

export type ChainsState = ChainsStateSlice & ChainsActions & ChainsSelectors
export type ChainsStore = UseBoundStoreWithEqualityFn<StoreApi<ChainsState>>
