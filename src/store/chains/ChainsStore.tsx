import type { PropsWithChildren } from 'react'
import type { ChainsState } from './types'
import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import { createContext, useContext, useRef } from 'react'
import { createWithEqualityFn } from 'zustand/traditional'

export type ChainStore = UseBoundStoreWithEqualityFn<StoreApi<ChainsState>>

export const ChainStoreContext = createContext<ChainStore | null>(null)

export function ChainStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<ChainStore>()
	if (!storeRef.current) {
		storeRef.current = createChainStore()
	}
	return <ChainStoreContext.Provider value={storeRef.current}>{children}</ChainStoreContext.Provider>
}

export function useChainStore<T>(selector: (state: ChainsState) => T, equalityFn?: (left: T, right: T) => boolean): T {
	const useStore = useContext(ChainStoreContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <${ChainStoreProvider.name}>.`)
	}
	return useStore(selector, equalityFn)
}

export function useChainStoreContext() {
	const useStore = useContext(ChainStoreContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <${ChainStoreProvider.name}>.`)
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
