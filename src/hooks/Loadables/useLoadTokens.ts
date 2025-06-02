import type { ExtendedToken } from '../../store/tokens/types'
import { useEffect, useCallback, useRef, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { handleFetchTokens } from '../../handlers/tokens'
import { useTokensStore } from '../../store/tokens/useTokensStore'
import { useChainsStore } from '../../store/chains/useChainsStore'
import { useModalsStore } from '../../store/modals/useModalsStore'

const FIVE_MINUTES_MS = 5 * 60 * 1000
const PAGINATION_LIMIT = 15

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

	const activeChain = useMemo(
		() => (isFromAssetModalOpen ? fromChain : isToAssetModalOpen ? toChain : null),
		[isFromAssetModalOpen, isToAssetModalOpen, fromChain, toChain],
	)

	const chainId = activeChain?.id
	const tokensRef = useRef<ExtendedToken[]>([])

	const fetchTokens = useCallback(
		async ({ chainId, offset, limit = 15, searchValue }: FetchTokensParams) => {
			if (!chainId) return []

			try {
				const tokens: ExtendedToken[] = await handleFetchTokens(chainId, offset, limit, searchValue)
				const chain = chains.find(c => c.id === chainId)

				return tokens.map((token: ExtendedToken) => ({
					...token,
					chainLogoURI: chain?.logoURI || null,
				}))
			} catch (error) {
				console.error('Failed to fetch tokens:', error)
				return []
			}
		},
		[chains],
	)

	const { data, isFetching } = useQuery({
		queryKey: ['tokens', chainId, offset, searchValue],
		queryFn: () =>
			fetchTokens({
				chainId,
				offset,
				limit: PAGINATION_LIMIT,
				searchValue,
			}),
		enabled: Boolean(chainId) && chains.length > 0,
		staleTime: FIVE_MINUTES_MS,
	})

	useEffect(() => {
		if (!data) return

		const isPaginating = offset > 0
		const isSearching = Boolean(searchValue)

		if (isSearching) {
			isPaginating ? addSearchedTokens(data) : setSearchedTokens(data)
		} else {
			if (isPaginating) {
				addTokens(data)
				tokensRef.current = [...tokensRef.current, ...data]
			} else {
				setTokens(data)
				tokensRef.current = data
			}
			setSearchedTokens([])
		}
	}, [data, offset, searchValue, addTokens, setTokens, addSearchedTokens, setSearchedTokens])

	useEffect(() => {
		if (searchValue && tokensRef.current.length > 0) {
			setTokens(tokensRef.current)
		}
	}, [searchValue, setTokens])

	useEffect(() => {
		setLoading(isFetching)
	}, [isFetching, setLoading])

	useEffect(() => {
		setOffset(0)
	}, [chainId, searchValue, setOffset])
}
