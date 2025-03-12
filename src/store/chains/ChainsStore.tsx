import type { PropsWithChildren } from 'react'
import type { ChainsState } from './types'
import type { ChainStore } from './types'
import { ChainsContext } from './ChainsContext'
import { useContext, useRef } from 'react'
import { CreateChainStore } from './CreateChainsStore'

export function ChainsStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<ChainStore>()
	if (!storeRef.current) {
		storeRef.current = CreateChainStore()
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
