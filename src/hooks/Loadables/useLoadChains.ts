import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useChainsStore } from '../../store/chains/useChainsStore'
import { getChains, toConceroChains } from '../../utils/new/chains'

export const useLoadChains = () => {
	const { setChains, setLoading } = useChainsStore()

	const {
		data: chains,
		isLoading: chainsLoading,
		refetch: refetchChains,
	} = useQuery({
		queryKey: ['chainsConfig'],
		queryFn: async () => {
			const response = await getChains()
			console.log('Fetched chains response:', response)
			return toConceroChains(response.payload.items)
		},
		staleTime: 30_000,

		retry: 2,
		refetchOnWindowFocus: false,
	})

	useEffect(() => {
		setChains(chains || [])
		setLoading(chainsLoading)
	}, [chains, chainsLoading, setChains, setLoading])

	return { chains: chains || [], loading: chainsLoading, refetchChains }
}
