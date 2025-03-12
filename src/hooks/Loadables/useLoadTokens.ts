import { useEffect, useCallback } from 'react'
import { useTokensStore } from '../../store/tokens/useTokensStore'
import { useChainsStore } from '../../store/chains/useChainsStore'
import { useQuery } from '@tanstack/react-query'
import { handleFetchTokens } from '../../handlers/tokens'

export const useLoadTokens = () => {
	const { selectedChain } = useChainsStore()
	const { setTokens, setLoading, setError, offset, setOffset, searchValue, clearTokens } = useTokensStore()

	const fetchTokens = useCallback(async () => {
		if (!selectedChain) return []

		setLoading(true)
		try {
			const newTokens = await handleFetchTokens(selectedChain.id, offset, 15, searchValue)
			setTokens(newTokens)
			return newTokens
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message)
			} else {
				setError('An unknown error occurred')
			}
			return []
		} finally {
			setLoading(false)
		}
	}, [selectedChain, offset, searchValue, setLoading, setTokens, setError])

	const { data } = useQuery({
		queryKey: ['tokens', selectedChain?.id, offset, searchValue],
		queryFn: fetchTokens,
		enabled: !!selectedChain,
	})

	useEffect(() => {
		if (data) {
			setTokens(data)
		}
	}, [data, setTokens])

	useEffect(() => {
		clearTokens()
		setOffset(0)
	}, [selectedChain, clearTokens, setOffset])

	useEffect(() => {
		setOffset(0)
	}, [searchValue, setOffset])

	useEffect(() => {
		fetchTokens()
	}, [searchValue, offset, fetchTokens])
}
