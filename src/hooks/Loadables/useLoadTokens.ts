import type { ExtendedToken } from '../../store/tokens/types'
import { useEffect, useCallback } from 'react'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { handleFetchTokens } from '../../handlers/tokens'
import { useTokensStore } from '../../store/tokens/useTokensStore'
import { useChainsStore } from '../../store/chains/useChainsStore'
import { useModalsStore } from '../../store/modals/useModalsStore'

const FIVE_MINUTES_MS = 5 * 60 * 1000

type FetchTokensParams = {
	chainId?: string
	offset: number
	limit: number
	searchValue: string
}

export const useLoadTokens = () => {
	const { chains } = useChainsStore()
	const { fromChain, toChain, isFromAssetModalOpen, isToAssetModalOpen } = useModalsStore()
	const { searchValue, offset, setTokens, addTokens, setLoading, setOffset, setSearchedTokens, addSearchedTokens } =
		useTokensStore()

	const activeChain = isFromAssetModalOpen ? fromChain : isToAssetModalOpen ? toChain : null
	const chainId = activeChain?.id

	const fetchTokens = useCallback(
		async ({ chainId, offset, limit = 15, searchValue }: FetchTokensParams): Promise<ExtendedToken[]> => {
			if (!chainId) return []

			try {
				const tokens = await handleFetchTokens(chainId, offset, limit, searchValue)
				const chain = chains.find(c => c.id === chainId)

				return tokens.map((token: ExtendedToken) => ({
					...token,
					chainLogoURI: chain?.logoURL || null,
				}))
			} catch (error) {
				console.error('Failed to fetch tokens:', error)
				return []
			}
		},
		[chains],
	)

	const { data, isFetching }: UseQueryResult<ExtendedToken[]> = useQuery({
		queryKey: ['tokens', chainId, offset, searchValue],
		queryFn: () =>
			fetchTokens({
				chainId,
				offset,
				limit: 15,
				searchValue,
			}),
		enabled: Boolean(chainId) && chains.length > 0,
		staleTime: FIVE_MINUTES_MS,
	})

	const processTokens = useCallback(
		(tokens: ExtendedToken[] | undefined): void => {
			if (!tokens) return

			const hasTokens = tokens.length > 0
			const isPagination = offset > 0
			const isSearching = Boolean(searchValue)

			if (isPagination) {
				if (hasTokens) {
					addTokens(tokens)
				}

				if (isSearching) {
					addSearchedTokens(tokens)
				}
			} else {
				setTokens(tokens)
				if (isSearching) {
					setSearchedTokens(tokens)
				}
			}
		},
		[offset, searchValue, setTokens, addTokens, setSearchedTokens, addSearchedTokens],
	)

	useEffect(() => {
		setLoading(isFetching)
	}, [isFetching, setLoading])

	useEffect(() => {
		processTokens(data)
	}, [data, processTokens])

	useEffect(() => {
		setOffset(0)
	}, [chainId, searchValue, setOffset])
}
