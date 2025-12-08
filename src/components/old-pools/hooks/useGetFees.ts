import { useEffect, useState, useCallback } from 'react'
import { get } from '../../../api/client'

export interface Fee {
	poolLiquidity: number
	loanGivenOut: number
	feeMade: number
	percentReturned: number
	timestamp: number
	chainId: number
	blockNumber: number
}

export const fetchFees = async (startTime?: number | null, endTime?: number | null): Promise<Fee[]> => {
	const filter = startTime && endTime ? `?startTime=${startTime}&endTime=${endTime}` : ''
	const url = `${process.env.CONCERO_API_URL}/bridgeFees${filter}`

	try {
		const response = await get(url)
		if (response.status !== 200) throw new Error('No fees found')
		return response.data.data
	} catch (error) {
		console.error('Error fetching fees:', error)
		throw error
	}
}

export const useGetFees = (startTime?: number | null, endTime?: number | null) => {
	const [fees, setFees] = useState<Fee[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const setApyHandle = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)
			const fees = await fetchFees(startTime, endTime)
			setFees(fees)
		} catch (error) {
			console.error('Error setting fees:', error)
			setError('Failed to fetch fees')
		} finally {
			setIsLoading(false)
		}
	}, [startTime, endTime])

	useEffect(() => {
		void setApyHandle()
	}, [setApyHandle])

	return { fees, isLoading, error }
}
