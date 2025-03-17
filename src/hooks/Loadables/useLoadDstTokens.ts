import type { ExtendedToken } from '../../store/tokens/types'
import { useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { handleFetchTokens } from '../../handlers/tokens'
import { useTokensStore } from '../../store/tokens/useTokensStore'
import { useFormStore } from '../../store/form/useFormStore'
import { useChainsStore } from '../../store/chains/useChainsStore'

export const useLoadDstTokens = () => {
	const {
		dstSearchValue,
		dstOffset,
		setDstTokens,
		addDstTokens,
		setDstTokensLoading,
		setDstOffset,
		setDstSearchedTokens,
	} = useTokensStore()
	const { dstChain } = useFormStore()
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

	const { data: destinationTokensData, isFetching: isFetchingDestinationTokens } = useQuery({
		queryKey: ['destinationTokens', dstChain?.id, dstOffset, dstSearchValue],
		queryFn: () => fetchTokens(dstChain?.id, dstOffset, dstSearchValue),
		enabled: !!dstChain,
		staleTime: 5 * 60 * 1000,
	})

	useEffect(() => {
		setDstTokensLoading(isFetchingDestinationTokens)
	}, [isFetchingDestinationTokens, setDstTokensLoading])

	useEffect(() => {
		if (destinationTokensData) {
			if (dstOffset > 0) {
				if (destinationTokensData.length > 0) {
					addDstTokens(destinationTokensData)
				}
			} else {
				setDstTokens(destinationTokensData)
			}
			if (dstSearchValue) {
				setDstSearchedTokens(destinationTokensData)
			}
		}
	}, [destinationTokensData, dstOffset, dstSearchValue, setDstTokens, addDstTokens, setDstSearchedTokens])

	useEffect(() => {
		setDstOffset(0)
	}, [dstChain, setDstOffset, dstSearchValue])
}
