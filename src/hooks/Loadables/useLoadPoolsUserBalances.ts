import type { Address } from 'viem'
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { getPublicClient } from '@/providers/Web3Provider/Web3Provider'
import { erc20Abi } from 'viem'
import { usePoolsUserBalancesStore } from '@/store/pools-user-balances/usePoolsUserBalancesStore'

const USDC_ADDRESS: Address = '0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d'
const LP_TOKEN_ADDRESS: Address = '0x4aABa0D6A62B9f35BA6B32f159f921a809B7b316'
const CHAIN_ID = 421614

export const useLoadPoolsUserBalances = () => {
	const { isConnected, address } = useAccount()
	const { setBalances, setIsLoading } = usePoolsUserBalancesStore()

	const {
		data: balances,
		isLoading: queryLoading,
		error,
		refetch: refetchBalances,
	} = useQuery({
		queryKey: ['poolsUserBalances', address, CHAIN_ID],
		queryFn: async () => {
			const publicClient = getPublicClient(CHAIN_ID)

			if (!address) {
				return { rawUsd: 0n, rawLp: 0n }
			}

			const [rawUsd, rawLp] = (await Promise.all([
				publicClient.readContract({
					address: USDC_ADDRESS,
					abi: erc20Abi,
					functionName: 'balanceOf',
					args: [address] as const,
				}),
				publicClient.readContract({
					address: LP_TOKEN_ADDRESS,
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
