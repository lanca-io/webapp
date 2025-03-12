import type { PropsWithChildren } from 'react'
import type { ChainsState } from './types'
import type { ChainStore } from './types'
import { ChainsContext } from './ChainsContext'
import { useContext, useRef } from 'react'
import { createWithEqualityFn } from 'zustand/traditional'

export function ChainsStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<ChainStore>()
	if (!storeRef.current) {
		storeRef.current = createChainStore()
	}
	return <ChainsContext.Provider value={storeRef.current}>{children}</ChainsContext.Provider>
}

export function useChainStore<T>(selector: (state: ChainsState) => T, equalityFn?: (left: T, right: T) => boolean): T {
	const useStore = useContext(ChainsContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <${ChainsStoreProvider.name}>.`)
	}
	return useStore(selector, equalityFn)
}

export function useChainStoreContext() {
	const useStore = useContext(ChainsContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <${ChainsStoreProvider.name}>.`)
	}
	return useStore
}

export const createChainStore = () =>
	createWithEqualityFn<ChainsState>(
		set => ({
			chains: [],
			isLoading: false,
			error: null,
			selectedChain: null,
			setChains: chains =>
				set(state => {
					const selectedChain = state.selectedChain || (chains.length > 0 ? chains[0] : null)
					return { chains, selectedChain }
				}),
			clearChains: () => set({ chains: [], selectedChain: null }),
			setLoading: isLoading => set({ isLoading }),
			setError: error => set({ error }),
			clearError: () => set({ error: null }),
			selectChain: chain => set({ selectedChain: chain }),
			clearSelectedChain: () => set({ selectedChain: null }),
		}),
		Object.is,
	)
