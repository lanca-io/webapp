import { useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { handleFetchBalances } from '../../handlers/tokens'
import { useBalancesStore } from '../../store/balances/useBalancesStore'
import { useAccount } from 'wagmi'
import { useChainsStore } from '../../store/chains/useChainsStore'
import type { ExtendedToken } from '../../store/tokens/types'

export const useLoadBalances = () => {
	const { address } = useAccount()
	const { chains } = useChainsStore()
	const { setBalances, setLoadingBalances } = useBalancesStore()

	const fetchBalances = useCallback(
		async (chainId: string): Promise<ExtendedToken[]> => {
			if (!address) return []
			try {
				const balances = await handleFetchBalances(chainId, address)
				const chain = chains.find(chain => chain.id === chainId)
				if (balances && balances[chainId] && chain) {
					return balances[chainId].map(({ _id, ...tokenData }) => ({
						...tokenData,
						chain_id: chainId,
						chainLogoURI: chain.logoURI,
					}))
				}
				return []
			} catch (error) {
				console.error('Error fetching balances for chain:', chainId, error)
				return []
			}
		},
		[address, chains],
	)

	const queryFn = useCallback(async () => {
		if (!address) return []
		const allBalances = await Promise.all(chains.map(chain => fetchBalances(chain.id)))
		const mergedBalances: ExtendedToken[] = allBalances.flat()
		return mergedBalances
	}, [address, chains, fetchBalances])

	const { data: balances, isLoading } = useQuery({
		queryKey: ['allBalances', address],
		queryFn,
		enabled: !!address && chains.length > 0,
		refetchInterval: 300_000,
	})

	useEffect(() => {
		setLoadingBalances(isLoading)
	}, [isLoading, setLoadingBalances])

	useEffect(() => {
		if (balances) {
			setBalances(balances)
		}
	}, [balances, setBalances])
}
