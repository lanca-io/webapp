import type { ChainsState } from './types'
import type { ILancaChain } from '@lanca/sdk'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateChainsStore = () =>
	createWithEqualityFn<ChainsState>(
		set => ({
			chains: [],
			isLoading: false,
			error: null,
			setChains: (chains: ILancaChain[]) => set({ chains }),
			clearChains: () => set({ chains: [] }),
			setLoading: (isLoading: boolean) => set({ isLoading }),
			setError: (error: string) => set({ error }),
			clearError: () => set({ error: null }),
		}),
		Object.is,
	)
