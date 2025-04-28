import type { ExtendedToken } from '../../store/tokens/types'
import { useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { handleFetchTokens } from '../../handlers/tokens'
import { useTokensStore } from '../../store/tokens/useTokensStore'
import { useChainsStore } from '../../store/chains/useChainsStore'

const FIVE_MINUTES_MS = 5 * 60 * 1000
const TOKENS_PER_CHAIN = 3

export const useLoadAllTokens = () => {
	const {
		allOffset: offset,
		allSearchValue: search,
		setAllTokens: setTokens,
		addAllTokens: addTokens,
		setAllTokensLoading: setLoading,
		setAllOffset: setOffset,
		setAllSearchedTokens: setSearched,
		addAllSearchedTokens: addSearched,
	} = useTokensStore()
	const { chains } = useChainsStore()

	const fetchTokens = useCallback(
		async (offset: number, search: string): Promise<ExtendedToken[]> => {
			try {
				const results = await Promise.all(
					chains.map(async chain => {
						const tokens = await handleFetchTokens(chain.id, offset, TOKENS_PER_CHAIN, search)
						return tokens.map((token: ExtendedToken) => ({
							...token,
							chainLogoURI: chain.logoURI || null,
						}))
					}),
				)
				return results.flat()
			} catch (error) {
				console.error(error)
				return []
			}
		},
		[chains],
	)

	const { data: tokens, isFetching: isLoading } = useQuery({
		queryKey: ['allTokens', offset, search],
		queryFn: () => fetchTokens(offset, search),
		enabled: chains.length > 0,
		staleTime: FIVE_MINUTES_MS,
	})

	const processTokens = useCallback(
		(data: ExtendedToken[] | undefined) => {
			if (!data) return

			const isPagination = offset > 0
			const isSearching = Boolean(search)

			if (isPagination) {
				addTokens(data)
				if (isSearching) {
					addSearched(data)
				}
			} else {
				setTokens(data)
				if (isSearching) {
					setSearched(data)
				}
			}
		},
		[offset, search, addTokens, setTokens, setSearched, addSearched],
	)

	useEffect(() => {
		setLoading(isLoading)
	}, [isLoading, setLoading])

	useEffect(() => {
		processTokens(tokens)
	}, [tokens, processTokens])

	useEffect(() => {
		setOffset(0)
	}, [search, setOffset])
}
