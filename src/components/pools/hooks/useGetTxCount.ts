import { useState, useEffect, useCallback } from 'react'
import { get } from '../../../api/client'

export const fetchTransactionsCount = async (): Promise<number> => {
	const url = `${process.env.CONCERO_API_URL}/bridgeTransactionsCount`

	try {
		const response = await get(url)
		if (response.status !== 200) throw new Error('No transactions found')
		return response.data.data
	} catch (error) {
		console.error('Error fetching transactions count:', error)
		throw error
	}
}

export const useGetTransactionsCount = () => {
	const [transactionsCount, setTransactionsCount] = useState<number>(0)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const fetchTransactionsCountHandle = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)
			const count = await fetchTransactionsCount()
			setTransactionsCount(count)
		} catch (error) {
			console.error('Error fetching transactions count:', error)
			setError('Failed to fetch transactions count')
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		void fetchTransactionsCountHandle()
	}, [fetchTransactionsCountHandle])

	return { transactionsCount, isLoading, error }
}
