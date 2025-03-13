import type { ExtendedToken } from '../../store/tokens/types'
import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { handleFetchTokens } from '../../handlers/tokens'
import { useTokensStore } from '../../store/tokens/useTokensStore'
import { useFormStore } from '../../store/form/useFormStore'

export const useLoadTokens = () => {
	const {
		srcSearchValue,
		srcOffset,
		setSrcTokens,
		setSrcTokensLoading,
		dstSearchValue,
		dstOffset,
		setDstTokens,
		setDstTokensLoading,
	} = useTokensStore()
	const { srcChain, dstChain } = useFormStore()

	const fetchSourceTokens = useMemo(
		() => async () => {
			setSrcTokensLoading(true)
			try {
				const tokens = await handleFetchTokens(srcChain!.id, srcOffset, 15, srcSearchValue)
				return tokens.map((token: ExtendedToken) => ({ ...token, balance: 0 }))
			} catch (error) {
				console.error(error)
				return []
			} finally {
				setSrcTokensLoading(false)
			}
		},
		[srcChain, srcOffset, srcSearchValue, setSrcTokensLoading],
	)

	const fetchDestinationTokens = useMemo(
		() => async () => {
			setDstTokensLoading(true)
			try {
				const tokens = await handleFetchTokens(dstChain!.id, dstOffset, 15, dstSearchValue)
				return tokens.map((token: ExtendedToken) => ({ ...token, balance: 0 }))
			} catch (error) {
				console.error(error)
				return []
			} finally {
				setDstTokensLoading(false)
			}
		},
		[dstChain, dstOffset, dstSearchValue, setDstTokensLoading],
	)

	const { data: sourceTokensData } = useQuery({
		queryKey: ['sourceTokens', srcChain?.id, srcOffset, srcSearchValue],
		queryFn: fetchSourceTokens,
		enabled: !!srcChain,
	})

	const { data: destinationTokensData } = useQuery({
		queryKey: ['destinationTokens', dstChain?.id, dstOffset, dstSearchValue],
		queryFn: fetchDestinationTokens,
		enabled: !!dstChain,
	})

	useEffect(() => {
		if (sourceTokensData) {
			setSrcTokens(sourceTokensData)
		}
	}, [sourceTokensData, setSrcTokens])

	useEffect(() => {
		if (destinationTokensData) {
			setDstTokens(destinationTokensData)
		}
	}, [destinationTokensData, setDstTokens])
}
