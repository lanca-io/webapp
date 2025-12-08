import { useState, useEffect, useCallback } from 'react'
import { type Address } from 'viem'
import { get } from '../../../api/client'

export interface UserEarnings {
	earnings: number
	percents: number
	deposit: number
}

export const fetchUserEarnings = async (address: Address): Promise<UserEarnings> => {
	const url = `${process.env.CONCERO_API_URL}/userPoolEarnings?address=${address}`

	try {
		const response = await get(url)
		if (response.status !== 200) throw new Error('No earnings found')
		return response.data.data
	} catch (error) {
		console.error('Error fetching user earnings:', error)
		throw error
	}
}

export const useGetUserEarnings = (address: Address | null | undefined) => {
	const [userEarnings, setUserEarnings] = useState<UserEarnings | null>(null)
	const [loading, setLoading] = useState<boolean>(true)
	const [error, setError] = useState<string | null>(null)

	const fetchUserEarningsHandle = useCallback(async () => {
		if (!address) {
			setUserEarnings(null)
			setLoading(false)
			return
		}

		try {
			setLoading(true)
			setError(null)
			const earnings = await fetchUserEarnings(address)
			setUserEarnings(earnings)
		} catch (error) {
			console.error('Error fetching user earnings:', error)
			setError('Failed to fetch user earnings')
			setUserEarnings(null)
		} finally {
			setLoading(false)
		}
	}, [address])

	useEffect(() => {
		void fetchUserEarningsHandle()
	}, [fetchUserEarningsHandle])

	return { userEarnings, loading, error }
}
