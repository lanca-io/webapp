import { useRoute } from './RouteStore'

export const useRouteStore = () => {
	const routes = useRoute(state => state.route)
	const error = useRoute(state => state.error)
	const loading = useRoute(state => state.loading)
	const setRoutes = useRoute(state => state.setRoute)
	const clearRoutes = useRoute(state => state.clearRoute)
	const setError = useRoute(state => state.setError)
	const clearError = useRoute(state => state.clearError)
	const setLoading = useRoute(state => state.setLoading)

	return {
		routes,
		error,
		loading,
		setRoutes,
		clearRoutes,
		setError,
		clearError,
		setLoading,
	}
}
