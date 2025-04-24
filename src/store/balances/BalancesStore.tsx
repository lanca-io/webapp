import type { PropsWithChildren } from 'react'
import type { BalancesStore } from './types'
import { useRef } from 'react'
import { BalancesContext } from './BalancesContext'
import { CreateBalancesStore } from './CreateBalancesStore'

export function BalancesStoreProvider({ children }: PropsWithChildren<{}>) {
	const storeRef = useRef<BalancesStore>()
	if (!storeRef.current) {
		storeRef.current = CreateBalancesStore()
	}
	return <BalancesContext.Provider value={storeRef.current}>{children}</BalancesContext.Provider>
}
