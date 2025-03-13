import { useEffect } from 'react'
import { useTokensStore } from '../../store/tokens/TokensStore'
import { useChainStore } from '../../store/chains/ChainsStore'
import { useQuery } from '@tanstack/react-query'
import { handleFetchTokens } from '../../handlers/tokens'

export const useLoadTokens = () => {
	const srcChain = useChainStore(state => state.sourceChain)
	const dstChain = useChainStore(state => state.destinationChain)
	const chainsLoading = useChainStore(state => state.isLoading)

	// Destination tokens state

	// Fetch source tokens
	const fetchSourceTokens = async () => {
		if (!sourceChain) return []
		setSourceLoading(true)
		try {
			const tokens = await handleFetchTokens(sourceChain.id, sourceOffset, 15, sourceSearchValue)
			return tokens
		} catch (error) {
			if (error instanceof Error) {
				setSourceError(error.message)
			} else {
				setSourceError('An unknown error occurred')
			}
			return []
		} finally {
			setSourceLoading(false)
		}
	}

	// Fetch destination tokens
	const fetchDestinationTokens = async () => {
		if (!destChain) return []
		setDestinationLoading(true)
		try {
			const tokens = await handleFetchTokens(destChain.id, destinationOffset, 15, destinationSearchValue)
			return tokens
		} catch (error) {
			if (error instanceof Error) {
				setDestinationError(error.message)
			} else {
				setDestinationError('An unknown error occurred')
			}
			return []
		} finally {
			setDestinationLoading(false)
		}
	}

	const { data: sourceTokensData } = useQuery({
		queryKey: ['sourceTokens', sourceChain?.id, sourceOffset, sourceSearchValue],
		queryFn: fetchSourceTokens,
		enabled: !chainsLoading && !!sourceChain,
	})

	// Destination tokens query
	const { data: destTokensData } = useQuery({
		queryKey: ['destinationTokens', destChain?.id, destinationOffset, destinationSearchValue],
		queryFn: fetchDestinationTokens,
		enabled: !chainsLoading && !!destChain,
	})

	useEffect(() => {
		if (sourceTokensData) {
			setSourceTokens(sourceTokensData)
		}
	}, [sourceTokensData, setSourceTokens])

	useEffect(() => {
		if (destTokensData) {
			setDestinationTokens(destTokensData)
		}
	}, [destTokensData, setDestinationTokens])

	useEffect(() => {
		clearSourceTokens()
	}, [sourceChain, sourceSearchValue, sourceOffset])

	useEffect(() => {
		clearDestinationTokens()
	}, [destChain, destinationSearchValue, destinationOffset])
}
