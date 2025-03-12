import type { ChainsState } from './types'
import type { ILancaChain } from '@lanca/sdk'
import { createWithEqualityFn } from 'zustand/traditional'

const DEFAULT_SRC_CHAIN = '10'
const DEFAULT_DEST_CHAIN = '137'

export const CreateChainStore = () =>
	createWithEqualityFn<ChainsState>(
		set => ({
			chains: [],
			isLoading: false,
			error: null,
			sourceChain: null,
			destinationChain: null,
			setChains: (chains: ILancaChain[]) => {
				set(() => {
					const sourceChain = chains.find(chain => chain.id === DEFAULT_SRC_CHAIN) || chains[0] || null
					const destinationChain = chains.find(chain => chain.id === DEFAULT_DEST_CHAIN) || chains[0] || null
					return {
						chains,
						sourceChain,
						destinationChain,
					}
				})
			},
			clearChains: () => set({ chains: [], sourceChain: null, destinationChain: null }),
			setLoading: (isLoading: boolean) => set({ isLoading }),
			setError: (error: string) => set({ error }),
			clearError: () => set({ error: null }),
			selectSourceChain: (chain: ILancaChain) => set({ sourceChain: chain }),
			selectDestinationChain: (chain: ILancaChain) => set({ destinationChain: chain }),
			clearSourceChain: () => set({ sourceChain: null }),
			clearDestinationChain: () => set({ destinationChain: null }),
			swapChains: () =>
				set(state => {
					if (
						state.sourceChain &&
						state.destinationChain &&
						state.sourceChain.id !== state.destinationChain.id
					) {
						return {
							sourceChain: state.destinationChain,
							destinationChain: state.sourceChain,
						}
					}
					return state
				}),
		}),
		Object.is,
	)
