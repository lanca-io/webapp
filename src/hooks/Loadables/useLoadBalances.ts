import { useEffect, useMemo } from 'react'
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

	const fetchBalances = async (chainId: string): Promise<ExtendedToken[]> => {
		if (!address) return []
		try {
			const balances = await handleFetchBalances(chainId, address)
			if (balances && balances[chainId]) {
				return balances[chainId].map(({ _id, ...tokenData }) => ({
					...tokenData,
					chain_id: chainId,
				}))
			}
			return []
		} catch (error) {
			console.error('Error fetching balances for chain:', chainId, error)
			return []
		}
	}

	const queryFn = useMemo(
		() => async () => {
			if (!address) return []
			const allBalances = await Promise.all(chains.map(chain => fetchBalances(chain.id)))
			const mergedBalances: ExtendedToken[] = allBalances.flat()
			return mergedBalances
		},
		[address, chains],
	)

	const {
		data: balances,
		isError,
		isLoading,
	} = useQuery({
		queryKey: ['allBalances', address],
		queryFn,
		enabled: !!address && chains.length > 0,
		refetchInterval: 300000,
	})

	useEffect(() => {
		setLoadingBalances(isLoading)
		if (balances) {
			setBalances(balances)
		}
	}, [balances, isLoading, isError, setBalances, setLoadingBalances])
}
