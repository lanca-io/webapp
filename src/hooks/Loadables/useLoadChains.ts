import type { ILancaChain } from '@lanca/sdk'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'
import { useChainsStore } from '../../store/chains/useChainsStore'
import { useLancaSDK } from '../../providers/SDKProvider/useLancaSDK'

export const useLoadChains = () => {
	const { setChains, setLoading, setError } = useChainsStore()
	const sdkClient = useLancaSDK()

	const queryFn = useMemo(
		() => async () => {
			const supportedChains = await sdkClient.getSupportedChains()
			return supportedChains?.map(
				(chain: ILancaChain): Partial<ILancaChain> => ({
					id: chain.id,
					name: chain.name,
					logoURI: chain.logoURI,
					explorerURI: chain.explorerURI,
				}),
			)
		},
		[sdkClient],
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
