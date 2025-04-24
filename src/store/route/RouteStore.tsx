import type { PropsWithChildren } from 'react'
import type { RoutesStore } from './types'
import { useRef } from 'react'
import { RoutesContext } from './RouteContext'
import { CreateRoutesStore } from './CreateRouteStore'

export function RoutesStoreProvider({ children }: PropsWithChildren) {
	const storeRef = useRef<RoutesStore>()

	if (!storeRef.current) {
		storeRef.current = CreateRoutesStore()
	}

	return <RoutesContext.Provider value={storeRef.current}>{children}</RoutesContext.Provider>
}
