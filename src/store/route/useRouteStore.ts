import { useContext } from 'react'
import { RoutesContext } from './RouteContext'

export const useRouteStore = () => {
	const useStore = useContext(RoutesContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <RoutesStoreProvider>.`)
	}

	const route = useStore(state => state.route)
	const isLoading = useStore(state => state.isLoading)
	const setRoute = useStore(state => state.setRoute)
	const clearRoute = useStore(state => state.clearRoute)
	const setIsLoading = useStore(state => state.setIsLoading)

	return {
		route,
		isLoading,
		setRoute,
		clearRoute,
		setIsLoading,
	}
}
