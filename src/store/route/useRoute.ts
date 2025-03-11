import { useRouteStore } from './RouteStore'

export const useRoute = () => {
	const routes = useRouteStore(state => state.route)
	const error = useRouteStore(state => state.error)
	const setRoutes = useRouteStore(state => state.setRoute)
	const clearRoutes = useRouteStore(state => state.clearRoute)
	const setError = useRouteStore(state => state.setError)
	const clearError = useRouteStore(state => state.clearError)

	return {
		routes,
		error,
		setRoutes,
		clearRoutes,
		setError,
		clearError,
	}
}
