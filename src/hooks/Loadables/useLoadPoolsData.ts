import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'

export const useLoadPoolsData = () => {
	const { setMetrics, setIsLoading } = usePoolsDataStore()

	const {
		data,
		isLoading: queryLoading,
		refetch,
	} = useQuery({
		queryKey: ['poolsData'],
		queryFn: async () => {
			const response = await fetch(
				'https://dev.concero.io/api/v1/pools?is_testnet=true',
			)
			if (!response.ok) throw new Error('Pools fetch failed')
			const json = await response.json()
			return json.payload
		},
		staleTime: 5 * 60_000,
		retry: 2,
		refetchOnWindowFocus: false,
	})

	useEffect(() => {
		setIsLoading(queryLoading)
		if (data) {
			setMetrics(data.supply, data.cap, data.tvl)
		}
	}, [data, queryLoading, setMetrics, setIsLoading])

	return { loading: queryLoading, refetch, data }
}
