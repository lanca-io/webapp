import { useState, useEffect, useCallback } from 'react'
import { type UserTransaction } from '../components/ConceroPool/UserActions/UserActions'
import { config } from '../../../constants/config'
import { get } from '../../../api/client'

export async function fetchParentPoolActionsByLpAddress(address: string): Promise<UserTransaction[] | []> {
	try {
		const url = config.baseURL + `/userParentPoolActions?lpAddress=${address}`
		const response = await get(url)

		if (!response.data.success) {
			return []
		}

		return response.data.data
	} catch (error) {
		console.error('Failed to fetch parent pool actions by lp address:', error)
		return []
	}
}

export const useGetUserActions = (address: string | undefined, retryTimeLeft: number) => {
	const [actions, setActions] = useState<UserTransaction[]>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<string | null>(null)

	const getActions = useCallback(async () => {
		if (!address) return
		if (retryTimeLeft !== 0) return

		setActions([])
		setIsLoading(true)
		setError(null)

		try {
			const actions = await fetchParentPoolActionsByLpAddress(address)
			setActions(actions)
		} catch (error) {
			console.error(error)
			setError('Failed to fetch actions')
		} finally {
			setIsLoading(false)
		}
	}, [address, retryTimeLeft])

	useEffect(() => {
		void getActions()
	}, [getActions])

	return { actions, isLoading, error }
}
