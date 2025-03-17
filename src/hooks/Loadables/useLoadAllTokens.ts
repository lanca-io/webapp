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
	} = useTokensStore()
	const { chains } = useChainsStore()

	const fetchAllSupportedTokens = useCallback(
		async (offset: number, searchValue: string) => {
			try {
				const allTokens = await Promise.all(
					chains.map(chain =>
						handleFetchTokens(chain.id, searchValue ? 0 : offset, searchValue ? undefined : 3, searchValue),
					),
				)
				return allTokens.flat().map((token: ExtendedToken) => ({
					...token,
					chainLogoURI: chains.find(chain => chain.id === token.chain_id)?.logoURI || null,
				}))
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

	useEffect(() => {
		setAllTokensLoading(isFetchingAllTokens)
	}, [isFetchingAllTokens, setAllTokensLoading])

	useEffect(() => {
		if (allTokensData) {
			if (allOffset > 0) {
				addAllTokens(allTokensData)
			} else {
				setAllTokens(allTokensData)
			}
			if (allSearchValue) {
				setAllSearchedTokens(allTokensData)
			}
		}
	}, [allTokensData, allOffset, allSearchValue, addAllTokens, setAllTokens, setAllSearchedTokens])

	useEffect(() => {
		setAllOffset(0)
	}, [setAllOffset])
}
