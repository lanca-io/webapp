import type { ILancaChain } from '@lanca/sdk'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useChainStore } from '../../store/chains/ChainsStore'
import { useLancaSDK } from '../../providers/SDKProvider/useLancaSDK'

export const useLoadChains = () => {
	const setChains = useChainStore(state => state.setChains)
	const setLoading = useChainStore(state => state.setLoading)
	const setError = useChainStore(state => state.setError)
	const client = useLancaSDK()

	const queryFn = useMemo(
		() => async () => {
			const supportedChains = await client.getSupportedChains()
			return supportedChains?.map(
				(chain: ILancaChain): Partial<ILancaChain> => ({
					id: chain.id,
					name: chain.name,
					logoURI: chain.logoURI,
					explorerURI: chain.explorerURI,
				}),
			)
		},
		[client],
	)

	const {
		data: chains,
		isError,
		isLoading,
		error,
	} = useQuery({
		queryKey: ['chains'] as const,
		queryFn,
		refetchInterval: 300_000,
		staleTime: 300_000,
	})

	useEffect(() => {
		setLoading(isLoading)
		if (chains) {
			setChains(chains as ILancaChain[])
		}
		if (isError && error instanceof Error) {
			setError(error.message)
		}
	}, [chains, isLoading, isError, error, setChains, setLoading, setError])
}
