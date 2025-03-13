import type { PropsWithChildren } from 'react'
import type { BalancesStore } from './types'
import { useContext, useRef } from 'react'
import { BalancesContext } from './BalancesContext'
import { CreateBalancesStore } from './CreateBalancesStore'

export function BalancesStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<BalancesStore>()
	if (!storeRef.current) {
		storeRef.current = CreateBalancesStore()
	}
	return <BalancesContext.Provider value={storeRef.current}>{children}</BalancesContext.Provider>
}

export function useBalancesStoreContext() {
	const useStore = useContext(BalancesContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <${BalancesStoreProvider.name}>.`)
	}
	return useStore
}
