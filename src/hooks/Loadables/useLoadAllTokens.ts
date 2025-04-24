import type { ExtendedToken } from '../../store/tokens/types'
import { useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { handleFetchTokens } from '../../handlers/tokens'
import { useTokensStore } from '../../store/tokens/useTokensStore'
import { useChainsStore } from '../../store/chains/useChainsStore'

export const useLoadAllTokens = () => {
	const {
		allOffset,
		allSearchValue,
		setAllTokens,
		addAllTokens,
		setAllTokensLoading,
		setAllOffset,
		setAllSearchedTokens,
		addAllSearchedTokens,
	} = useTokensStore()
	const { chains } = useChainsStore()

	const fetchAllSupportedTokens = useCallback(
		async (offset: number, searchValue: string) => {
			try {
				const allTokens = await Promise.all(
					chains.map(async chain => {
						const tokens = await handleFetchTokens(chain.id, offset, 3, searchValue)
						return tokens.map((token: ExtendedToken) => ({
							...token,
							chainLogoURI: chain.logoURI || null,
						}))
					}),
				)
				return allTokens.flat()
			} catch (error) {
				console.error(error)
				return []
			}
		},
		[chains],
	)

	const { data: allTokensData, isFetching: isFetchingAllTokens } = useQuery({
		queryKey: ['allTokens', allOffset, allSearchValue],
		queryFn: () => fetchAllSupportedTokens(allOffset, allSearchValue),
		enabled: chains.length > 0,
		staleTime: 5 * 60 * 1000,
	})

	const processAllTokensData = useCallback(
		(data: ExtendedToken[] | undefined) => {
			if (!data) return

			if (allOffset > 0) {
				addAllTokens(data)
				if (allSearchValue) {
					addAllSearchedTokens(data)
				}
			} else {
				setAllTokens(data)
				if (allSearchValue) {
					setAllSearchedTokens(data)
				}
			}
		},
		[allOffset, allSearchValue, addAllTokens, setAllTokens, setAllSearchedTokens, addAllSearchedTokens],
	)

	useEffect(() => {
		setAllTokensLoading(isFetchingAllTokens)
	}, [isFetchingAllTokens, setAllTokensLoading])

	useEffect(() => {
		processAllTokensData(allTokensData)
	}, [allTokensData, processAllTokensData])

	useEffect(() => {
		setAllOffset(0)
	}, [allSearchValue, setAllOffset])
}
