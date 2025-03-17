import type { ExtendedToken } from '../../store/tokens/types'
import { useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { handleFetchTokens } from '../../handlers/tokens'
import { useTokensStore } from '../../store/tokens/useTokensStore'
import { useFormStore } from '../../store/form/useFormStore'
import { useChainsStore } from '../../store/chains/useChainsStore'

export const useLoadSrcTokens = () => {
	const {
		srcSearchValue,
		srcOffset,
		setSrcTokens,
		addSrcTokens,
		setSrcTokensLoading,
		setSrcOffset,
		setSrcSearchedTokens,
	} = useTokensStore()
	const { srcChain } = useFormStore()
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

	const { data: sourceTokensData, isFetching: isFetchingSourceTokens } = useQuery({
		queryKey: ['sourceTokens', srcChain?.id, srcOffset, srcSearchValue],
		queryFn: () => fetchTokens(srcChain?.id, srcOffset, srcSearchValue),
		enabled: !!srcChain,
		staleTime: 5 * 60 * 1000,
	})

	useEffect(() => {
		setSrcTokensLoading(isFetchingSourceTokens)
	}, [isFetchingSourceTokens, setSrcTokensLoading])

	useEffect(() => {
		if (sourceTokensData) {
			if (srcOffset > 0) {
				if (sourceTokensData.length > 0) {
					addSrcTokens(sourceTokensData)
				}
			} else {
				setSrcTokens(sourceTokensData)
			}
			if (srcSearchValue) {
				setSrcSearchedTokens(sourceTokensData)
			}
		}
	}, [sourceTokensData, srcOffset, srcSearchValue, setSrcTokens, addSrcTokens, setSrcSearchedTokens])

	useEffect(() => {
		setSrcOffset(0)
	}, [srcChain, setSrcOffset, srcSearchValue])
}
