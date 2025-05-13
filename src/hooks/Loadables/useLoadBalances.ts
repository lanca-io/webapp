import type { ExtendedToken } from '../../store/tokens/types'
import { useEffect, useCallback, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { handleFetchBalances } from '../../handlers/tokens'
import { useBalancesStore } from '../../store/balances/useBalancesStore'
import { useAccount } from 'wagmi'
import { useChainsStore } from '../../store/chains/useChainsStore'

const FIVE_MINUTES_MS = 300_000
const MAX_RETRIES = 2

export const useLoadBalances = () => {
	const { address } = useAccount()
	const { chains } = useChainsStore()
	const { setBalances, setIsLoading: setLoading } = useBalancesStore()

	const chainList = useMemo(() => chains, [chains])

	const fetchChain = useCallback(
		async (chainId: string): Promise<ExtendedToken[]> => {
			if (!address) return []

			try {
				const data = await handleFetchBalances(chainId, address)
				const chain = chains.find(c => c.id === chainId)

				if (!data || !data[chainId] || !chain) return []

				return data[chainId].map(({ _id, ...token }) => ({
					...token,
					chain_id: chainId,
					chainLogoURI: chain.logoURL,
				}))
			} catch (error) {
				console.error('Error fetching balances for chain:', chainId, error)
				return []
			}
		},
		[address, chains],
	)

	const fetchBalances = useCallback(async () => {
		if (!address || chainList.length === 0) return []

		const results = await Promise.allSettled(chainList.map(chain => fetchChain(chain.id)))

		return results
			.filter((result): result is PromiseFulfilledResult<ExtendedToken[]> => result.status === 'fulfilled')
			.flatMap(result => result.value)
	}, [address, chainList, fetchChain])

	const { data: balances, isLoading } = useQuery({
		queryKey: ['balances', address, chainList.map(c => c.id).join()],
		queryFn: fetchBalances,
		enabled: Boolean(address) && chainList.length > 0,
		refetchInterval: FIVE_MINUTES_MS,
		retry: MAX_RETRIES,
	})

	useEffect(() => {
		setLoading(isLoading)
	}, [isLoading, setLoading])

	useEffect(() => {
		if (balances) {
			setBalances(balances)
		}
	}, [balances, setBalances])
}
