import type { ILancaChain } from '@lanca/sdk'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'

export type ChainsState = {
	chains: ILancaChain[]
	isLoading: boolean
	error: string | null
	selectedSrcChain: ILancaChain | null
	selectedDstChain: ILancaChain | null
	setChains: (chains: ILancaChain[]) => void
	clearChains: () => void
	setLoading: (isLoading: boolean) => void
	setError: (error: string) => void
	clearError: () => void
	setSelectedSrcChain: (chain: ILancaChain | null) => void
	setSelectedDstChain: (chain: ILancaChain | null) => void
}

export type ChainsStore = UseBoundStoreWithEqualityFn<StoreApi<ChainsState>>
