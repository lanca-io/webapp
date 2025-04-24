import type { ExtendedToken } from '../../store/tokens/types'
import { useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { handleFetchTokens } from '../../handlers/tokens'
import { useTokensStore } from '../../store/tokens/useTokensStore'
import { useChainsStore } from '../../store/chains/useChainsStore'

export const useLoadTokens = (chainId?: string) => {
	const { searchValue, offset, setTokens, addTokens, setLoading, setOffset, setSearchedTokens, addSearchedTokens } =
		useTokensStore()

	const { chains } = useChainsStore()

	const fetchTokens = useCallback(
		async (chainId: string | undefined, offset: number, searchValue: string) => {
			try {
				const tokens = await handleFetchTokens(chainId, offset, 15, searchValue)
				const chain = chains.find(chain => chain.id === chainId)
				return tokens.map((token: ExtendedToken) => ({
					...token,
					chainLogoURI: chain?.logoURI || null,
				}))
			} catch (error) {
				console.error(error)
				return []
			}
		},
		[chains],
	)

	const { data: tokensData, isFetching } = useQuery({
		queryKey: ['tokens', chainId, offset, searchValue],
		queryFn: () => fetchTokens(chainId, offset, searchValue),
		enabled: !!chainId && chains.length > 0,
		staleTime: 5 * 60 * 1000,
	})

	const processTokensData = useCallback(
		(data: ExtendedToken[] | undefined) => {
			if (!data) return

			if (offset > 0) {
				if (data.length > 0) {
					addTokens(data)
				}
				if (searchValue) {
					addSearchedTokens(data)
				}
			} else {
				setTokens(data)
				if (searchValue) {
					setSearchedTokens(data)
				}
			}
		},
		[offset, searchValue, setTokens, addTokens, setSearchedTokens, addSearchedTokens],
	)

	useEffect(() => {
		setLoading(isFetching)
	}, [isFetching, setLoading])

	useEffect(() => {
		processTokensData(tokensData)
	}, [tokensData, processTokensData])

	useEffect(() => {
		setOffset(0)
	}, [chainId, searchValue, setOffset])
}
