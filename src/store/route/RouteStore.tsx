import type { PropsWithChildren } from 'react'
import type { RoutesStore, RoutesState, RoutesProviderProps } from './types'
import { useContext, useRef } from 'react'
import { createWithEqualityFn } from 'zustand/traditional'
import { RouteContext } from './RouteContext'
import { RouteStepsValidation } from './RouteStepsValidation'

export const createRoutesStore = ({ route }: RoutesProviderProps) =>
	createWithEqualityFn<RoutesState>(
		set => ({
			route: route || null,
			error: null,
			loading: false,
			setRoute: route => {
				const validatedRoute = RouteStepsValidation(route)
				set({ route: validatedRoute })
			},
			clearRoute: () => {
				set({ route: null })
			},
			setError: error => {
				set({ error })
			},
			clearError: () => {
				set({ error: null })
			},
			setLoading: loading => {
				set({ loading })
			},
		}),
		Object.is,
	)

const shouldRecreateStore = (store: RoutesStore, props: RoutesProviderProps) => {
	const { route } = store.getState()
	return route !== props.route
}

export function RoutesStoreProvider({ children, ...props }: PropsWithChildren<RoutesProviderProps>) {
	const storeRef = useRef<RoutesStore>()
	if (!storeRef.current || shouldRecreateStore(storeRef.current, props)) {
		storeRef.current = createRoutesStore(props)
	}
	return <RouteContext.Provider value={storeRef.current}>{children}</RouteContext.Provider>
}

export function useRouteStore<T>(selector: (state: RoutesState) => T, equalityFn?: (left: T, right: T) => boolean): T {
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
