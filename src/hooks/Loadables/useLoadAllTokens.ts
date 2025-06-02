import type { ExtendedToken } from '../../store/tokens/types'
import { useEffect, useCallback, useRef, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { handleFetchTokens } from '../../handlers/tokens'
import { useTokensStore } from '../../store/tokens/useTokensStore'
import { useChainsStore } from '../../store/chains/useChainsStore'

const CACHE_TIME = 5 * 60 * 1000
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

	const tokensRef = useRef<ExtendedToken[]>([])

	const fetchTokens = useCallback(
		async (offset: number, search: string): Promise<ExtendedToken[]> => {
			if (chains.length === 0) return []

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
				console.error('Failed to fetch all tokens:', error)
				return []
			}
		},
		[chains],
	)

	const queryKey = useMemo(() => ['allTokens', offset, search], [offset, search])
	const { data: tokens, isFetching: isLoading } = useQuery({
		queryKey,
		queryFn: () => fetchTokens(offset, search),
		enabled: chains.length > 0,
		staleTime: CACHE_TIME,
	})

	useEffect(() => {
		if (!tokens) return

		const isPaginating = offset > 0
		const isSearching = Boolean(search)

		const updateStrategies = {
			search: isPaginating ? addSearched : setSearched,
			default: isPaginating
				? (items: ExtendedToken[]) => {
						addTokens(items)
						tokensRef.current = [...tokensRef.current, ...items]
					}
				: (items: ExtendedToken[]) => {
						setTokens(items)
						tokensRef.current = items
					},
		}

		const handler = isSearching ? updateStrategies.search : updateStrategies.default
		handler(tokens)

		if (!isSearching) {
			setSearched([])
		}
	}, [tokens, offset, search, addTokens, setTokens, addSearched, setSearched])

	useEffect(() => {
		if (search && tokensRef.current.length > 0) {
			setTokens(tokensRef.current)
		}
	}, [search, setTokens])

	useEffect(() => {
		setLoading(isLoading)
	}, [isLoading, setLoading])

	useEffect(() => {
		setOffset(0)
	}, [search, setOffset])
}
