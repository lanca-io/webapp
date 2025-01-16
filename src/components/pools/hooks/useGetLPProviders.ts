import { useState, useEffect, useCallback } from 'react'
import { get } from '../../../api/client'

export const getLpProvidersCount = async (): Promise<number> => {
	const url = `${process.env.CONCERO_API_URL}/lpProvidersCount`

	try {
		const response = await get(url)
		if (response.status !== 200) throw new Error('No LP providers found')
		return response.data.data
	} catch (error) {
		console.error('Error fetching LP providers count:', error)
		throw error
	}
}

export const useGetLPProvidersCount = () => {
	const [lpProviders, setLpProviders] = useState<number>(0)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const fetchLpProvidersCountHandle = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)
			const count = await getLpProvidersCount()
			setLpProviders(count)
		} catch (error) {
			console.error('Error fetching LP providers count:', error)
			setError('Failed to fetch LP providers count')
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		void fetchLpProvidersCountHandle()
	}, [fetchLpProvidersCountHandle])

	return { lpProviders, isLoading, error }
}
