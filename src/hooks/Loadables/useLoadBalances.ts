import type { ExtendedToken } from '../../store/tokens/types'
import { useEffect, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { handleFetchBalances } from '../../handlers/tokens'
import { useBalancesStore } from '../../store/balances/useBalancesStore'
import { useFormStore } from '../../store/form/useFormStore'
import { useAccount } from 'wagmi'
import { useChainsStore } from '../../store/chains/useChainsStore'
import { useTxProcess } from '../useTxProcess'
import { Status } from '@lanca/sdk'
import { areTokensEqual } from '../../utils/new/tokens'

const REFRESH_INTERVAL_MS = 300_000
const MAX_RETRIES = 2

export const useLoadBalances = () => {
	const { address } = useAccount()
	const { chains } = useChainsStore()
	const { setBalances, setIsLoading } = useBalancesStore()
	const { fromToken, toToken, setFromToken, setToToken } = useFormStore()
	const { txStatus } = useTxProcess()

	const fetchBalancesForChain = useCallback(
		async (chainId: string): Promise<ExtendedToken[]> => {
			if (!address) return []

			try {
				const data = await handleFetchBalances(chainId, address)
				const chain = chains.find(c => c.id === chainId)

				if (!Array.isArray(data) || !chain) return []

				return data.map(({ _id, ...token }) => ({
					...token,
					chain_id: chainId,
					chainLogoURI: chain.logoURI,
				}))
			} catch (error) {
				console.error(`Error fetching balances for chain ${chainId}:`, error)
				return []
			}
		},
		[address, chains],
	)

	const fetchAllBalances = useCallback(async () => {
		if (!address || chains.length === 0) return []

		const results = await Promise.allSettled(chains.map(chain => fetchBalancesForChain(chain.id)))

		return results
			.filter((result): result is PromiseFulfilledResult<ExtendedToken[]> => result.status === 'fulfilled')
			.flatMap(result => result.value)
	}, [address, chains, fetchBalancesForChain])

	const {
		data: balances,
		isLoading,
		refetch,
	} = useQuery({
		queryKey: ['balances', address, chains.map(c => c.id).join()],
		queryFn: fetchAllBalances,
		enabled: Boolean(address) && chains.length > 0,
		refetchInterval: REFRESH_INTERVAL_MS,
		retry: MAX_RETRIES,
	})

	const updateTokensInFormStore = useCallback(
		(balances: ExtendedToken[]) => {
			const updatedFromToken =
				fromToken &&
				balances.find(token => token.address === fromToken.address && token.chain_id === fromToken.chain_id)

			const updatedToToken =
				toToken &&
				balances.find(token => token.address === toToken.address && token.chain_id === toToken.chain_id)

			if (fromToken) {
				if (!updatedFromToken) {
					if (fromToken.balance !== '0') {
						const zeroBalanceToken: ExtendedToken = {
							...fromToken,
							balance: '0',
						}
						setFromToken(zeroBalanceToken)
					}
				} else if (!areTokensEqual(fromToken, updatedFromToken)) {
					setFromToken(updatedFromToken)
				}
			}

			if (toToken) {
				if (!updatedToToken) {
					if (toToken.balance !== '0') {
						const zeroBalanceToken: ExtendedToken = {
							...toToken,
							balance: '0',
						}
						setToToken(zeroBalanceToken)
					}
				} else if (!areTokensEqual(toToken, updatedToToken)) {
					setToToken(updatedToToken)
				}
			}
		},
		[fromToken, toToken, setFromToken, setToToken],
	)

	useEffect(() => {
		setIsLoading(isLoading)
	}, [isLoading, setIsLoading])

	useEffect(() => {
		if (balances) {
			setBalances(balances)
			updateTokensInFormStore(balances)
		}
	}, [balances, setBalances, updateTokensInFormStore])

	useEffect(() => {
		if (txStatus === Status.SUCCESS) {
			refetch()
		}
	}, [txStatus, refetch])
}
