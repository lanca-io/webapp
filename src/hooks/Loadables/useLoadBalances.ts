import type { ExtendedToken } from '../../store/tokens/types'
import { useEffect, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { handleFetchBalances } from '../../handlers/tokens'
import { useBalancesStore } from '../../store/balances/useBalancesStore'
import { useAccount } from 'wagmi'
import { useChainsStore } from '../../store/chains/useChainsStore'

export const useLoadBalances = () => {
	const { address } = useAccount()
	const { chains } = useChainsStore()
	const { setBalances, setIsLoading } = useBalancesStore()

	const chainList = useMemo(() => chains, [chains])

	const fetchChainBalances = useCallback(
		async (chainId: string): Promise<ExtendedToken[]> => {
			if (!address) return []

			try {
				const data = await handleFetchBalances(chainId, address)
				const chain = chains.find(c => c.id === chainId)

				if (!data || !data[chainId] || !chain) return []

				return data[chainId].map(({ _id, ...token }) => ({
					...token,
					chain_id: chainId,
					chainLogoURI: chain.logoURI,
				}))
			} catch (error) {
				console.error('Error fetching balances for chain:', chainId, error)
				return []
			}
		},
		[address, chains],
	)

	const fetchAllBalances = useCallback(async () => {
		if (!address || chainList.length === 0) return []

		const results = await Promise.allSettled(chainList.map(chain => fetchChainBalances(chain.id)))

		return results
			.filter((result): result is PromiseFulfilledResult<ExtendedToken[]> => result.status === 'fulfilled')
			.flatMap(result => result.value)
	}, [address, chainList, fetchChainBalances])

	const {
		data: balances,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['balances', address, chainList.map(c => c.id).join()],
		queryFn: fetchAllBalances,
		enabled: !!address && chainList.length > 0,
		refetchInterval: 300_000,
		retry: 2,
	})

	useEffect(() => {
		setIsLoading(isLoading)
	}, [isLoading, setIsLoading])

	useEffect(() => {
		if (balances) {
			setBalances(balances)
		}
	}, [balances, setBalances])

	return {
		refetch,
	}
}
