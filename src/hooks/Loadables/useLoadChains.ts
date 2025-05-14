import type { ILancaChain } from '@lanca/sdk'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useCallback } from 'react'
import { useChainsStore } from '../../store/chains/useChainsStore'
import { useLancaSDK } from '../../providers/SDKProvider/useLancaSDK'

const ONE_HOUR_MS = 3_600_000
const TWO_HOURS_MS = 7_200_000

type SimplifiedChain = Pick<ILancaChain, 'id' | 'name' | 'logoURI' | 'explorerURI'>

export const useLoadChains = () => {
	const { setChains, setLoading } = useChainsStore()
	const client = useLancaSDK()

	const fetchChains = useCallback(async (): Promise<SimplifiedChain[]> => {
		try {
			const supportedChains = await client.getSupportedChains()

			return (
				supportedChains?.map((chain: ILancaChain) => ({
					id: chain.id,
					name: chain.name,
					logoURI: chain.logoURI,
					explorerURI: chain.explorerURI,
				})) || []
			)
		} catch (error) {
			console.error('Failed to fetch chains:', error)
			return []
		}
	}, [client])

	const { data: chains, isLoading } = useQuery({
		queryKey: ['chains'],
		queryFn: fetchChains,
		refetchInterval: ONE_HOUR_MS,
		staleTime: ONE_HOUR_MS,
		gcTime: TWO_HOURS_MS,
	})

	useEffect(() => {
		setLoading(isLoading)
	}, [isLoading, setLoading])

	useEffect(() => {
		if (chains) {
			setChains(chains as ILancaChain[])
		}
	}, [chains, setChains])
}
