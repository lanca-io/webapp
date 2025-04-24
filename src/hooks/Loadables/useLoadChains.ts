import type { ILancaChain } from '@lanca/sdk'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { useChainsStore } from '../../store/chains/useChainsStore'
import { useLancaSDK } from '../../providers/SDKProvider/useLancaSDK'

export const useLoadChains = () => {
	const { setChains, setLoading } = useChainsStore()
	const client = useLancaSDK()

	const fetchChains = useCallback(async () => {
		const supportedChains = await client.getSupportedChains()
		return supportedChains?.map(
			(chain: ILancaChain): Partial<ILancaChain> => ({
				id: chain.id,
				name: chain.name,
				logoURI: chain.logoURI,
				explorerURI: chain.explorerURI,
			}),
		)
	}, [client])

	const {
		data: chains,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['chains'],
		queryFn: fetchChains,
		refetchInterval: 3_600_000, // 1 hour
		staleTime: 3_600_000, // 1 hour
		gcTime: 7_200_000, // 2 hours
	})

	useEffect(() => {
		setLoading(isLoading)
	}, [isLoading, setLoading])

	useEffect(() => {
		if (chains) {
			setChains(chains as ILancaChain[])
		}
	}, [chains, setChains])

	return {
		isLoading,
		refetch,
	}
}
