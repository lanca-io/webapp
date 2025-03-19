import type { PropsWithChildren } from 'react'
import type { RoutesStore, RoutesState, RoutesProviderProps } from './types'
import { useContext, useRef } from 'react'
import { RouteContext } from './RouteContext'
import { CreateRoutesStore } from './CreateRouteStore'

const shouldRecreateStore = (store: RoutesStore, props: RoutesProviderProps) => {
	const { route } = store.getState()
	return route !== props.route
}

export function RoutesStoreProvider({ children, ...props }: PropsWithChildren<RoutesProviderProps>) {
	const storeRef = useRef<RoutesStore>()
	if (!storeRef.current || shouldRecreateStore(storeRef.current, props)) {
		storeRef.current = CreateRoutesStore(props)
	}
	return <RouteContext.Provider value={storeRef.current}>{children}</RouteContext.Provider>
}

export function useRoute<T>(selector: (state: RoutesState) => T, equalityFn?: (left: T, right: T) => boolean): T {
	const useStore = useContext(RouteContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <${RoutesStoreProvider.name}>.`)
	}
	return useStore(selector, equalityFn)
}

export function useRoutesStoreContext() {
	const useStore = useContext(RouteContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <${RoutesStoreProvider.name}>.`)
	}
	return useStore
}
