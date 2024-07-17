import { type RouteRequest } from './types/routeTypes'
import { get } from '../api/client'
import { trackEvent } from '../hooks/useTracking'
import { action, category } from '../constants/tracking'

export const findRoute = async (routeRequest: RouteRequest) => {
	const { fromChainId, fromTokenAddress, toTokenAddress, fromAmount, toChainId } = routeRequest

	try {
		const routeRes = await get(
			`${process.env.CONCERO_API_URL}/route/?fromToken=${fromTokenAddress}&toToken=${toTokenAddress}&fromChainId=${fromChainId}&toChainId=${toChainId}&amount=${fromAmount}&slippageTolerance=0.5`,
		)

		if (!routeRes) throw new Error('Route not found!')

		if (!routeRes.data.success) {
			throw new Error(routeRes.data.data)
		}

		return routeRes.data
	} catch (error) {
		if (error.status === 404) {
			void trackEvent({
				category: category.SwapCard,
				action: action.FetchConceroRoutesNotFound,
				label: 'action_fetch_concero_routes_not_found',
				data: { error },
			})
			throw error
		}

		void trackEvent({
			category: category.SwapCard,
			action: action.FetchConceroRoutesError,
			label: 'fetch_concero_route_error',
			data: { error },
		})
		console.error('Fetch concero route error: ', error)
	}
}
