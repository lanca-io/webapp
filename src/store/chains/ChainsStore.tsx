import type { PropsWithChildren } from 'react'
import type { ChainsStore } from './types'
import { useContext, useRef } from 'react'
import { CreateChainsStore } from './CreateChainsStore'
import { ChainsContext } from './ChainsContext'

export function ChainsStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<ChainsStore | null>(null)
	if (!storeRef.current) {
		storeRef.current = CreateChainsStore()
	}
	return <ChainsContext.Provider value={storeRef.current}>{children}</ChainsContext.Provider>
}

export function useChainStoreContext() {
	const useStore = useContext(ChainsContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <${ChainsStoreProvider.name}>.`)
	}
	return useStore
}
