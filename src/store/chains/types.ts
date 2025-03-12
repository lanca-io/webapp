import type { ILancaChain } from '@lanca/sdk'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'

export type ChainsState = {
	chains: ILancaChain[]
	isLoading: boolean
	error: string | null
	sourceChain: ILancaChain | null
	destinationChain: ILancaChain | null
	setChains: (chains: ILancaChain[]) => void
	clearChains: () => void
	setLoading: (isLoading: boolean) => void
	setError: (error: string) => void
	clearError: () => void
	selectSourceChain: (chain: ILancaChain) => void
	selectDestinationChain: (chain: ILancaChain) => void
	clearSourceChain: () => void
	clearDestinationChain: () => void
	swapChains: () => void
}

export type ChainStore = UseBoundStoreWithEqualityFn<StoreApi<ChainsState>>
