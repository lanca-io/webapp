import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { getPublicClient } from '@/providers/Web3Provider/Web3Provider'
import { erc20Abi } from 'viem'
import { usePoolsUserBalancesStore } from '@/store/pools-user-balances/usePoolsUserBalancesStore'
import {
	POOLS_CHAIN_ID,
	POOLS_LP_TOKEN_ADDRESS,
	POOLS_USDC_ADDRESS,
} from '@/configuration/pools'

export const useLoadPoolsUserBalances = () => {
	const { isConnected, address } = useAccount()
	const { setBalances, setIsLoading } = usePoolsUserBalancesStore()

	const {
		data: balances,
		isLoading: queryLoading,
		error,
		refetch: refetchBalances,
	} = useQuery({
		queryKey: ['poolsUserBalances', address, POOLS_CHAIN_ID],
		queryFn: async () => {
			const publicClient = getPublicClient(POOLS_CHAIN_ID)

			if (!address) {
				return { rawUsd: 0n, rawLp: 0n }
			}

			const [rawUsd, rawLp] = (await Promise.all([
				publicClient.readContract({
					address: POOLS_USDC_ADDRESS,
					abi: erc20Abi,
					functionName: 'balanceOf',
					args: [address] as const,
				}),
				publicClient.readContract({
					address: POOLS_LP_TOKEN_ADDRESS,
					abi: erc20Abi,
					functionName: 'balanceOf',
					args: [address] as const,
				}),
			])) as [bigint, bigint]

			return { rawUsd, rawLp }
		},
		enabled: isConnected && !!address,
		staleTime: 30_000,
		retry: 3,
		refetchOnWindowFocus: false,
	})

	useEffect(() => {
		if (isConnected) {
			setBalances(balances?.rawUsd ?? 0n, balances?.rawLp ?? 0n)
			setIsLoading(queryLoading)
		} else {
			setIsLoading(false)
		}
	}, [balances, queryLoading, isConnected, setBalances, setIsLoading])

	useEffect(() => {
		if (error) {
			console.error('❌ Query error:', error)
		}
	}, [error])

	return {
		balances: balances ?? { rawUsd: null, rawLp: null },
		loading: queryLoading,
		error,
		refetchBalances,
	}
}
