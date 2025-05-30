import type { ChainsState } from './types'
import type { ILancaChain } from '@lanca/sdk'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateChainsStore = () =>
	createWithEqualityFn<ChainsState>(
		(set, get) => ({
			chains: [],
			isLoading: false,
			setChains: (chains: ILancaChain[]) => set({ chains }),
			clearChains: () => set({ chains: [] }),
			setLoading: (isLoading: boolean) => set({ isLoading }),
			getChainById: (id: string) => {
				const { chains } = get()
				return chains.find(chain => chain.id === id)
			},
		}),
		Object.is,
	)
