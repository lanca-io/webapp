import type { ILancaChain } from '@lanca/sdk'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'

export type ChainsState = {
	chains: ILancaChain[]
	isLoading: boolean
	error: string | null
	setChains: (chains: ILancaChain[]) => void
	clearChains: () => void
	setLoading: (isLoading: boolean) => void
	setError: (error: string) => void
	clearError: () => void
}

export type ChainsStore = UseBoundStoreWithEqualityFn<StoreApi<ChainsState>>
