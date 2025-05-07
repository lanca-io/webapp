import { useRouteStore } from '../store/route/useRouteStore'

export const useEstimateGas = () => {
	const { route } = useRouteStore()

	console.log('useEstimateGas', route)
}
