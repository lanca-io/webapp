import type { ExtendedToken } from '../store/tokens/types'
import { useState, useEffect } from 'react'
import { useBalancesStore } from '../store/balances/useBalancesStore'

type UseGetBalancesResult = {
	balances: ExtendedToken[]
	isLoading: boolean
}

export const useGetBalances = (chainId?: string): UseGetBalancesResult => {
	const { balances: allBalances, isLoading, getBalancesByChainId } = useBalancesStore()
	const [balances, setBalances] = useState<ExtendedToken[]>([])

	useEffect(() => {
		if (!chainId) {
			setBalances(allBalances)
		} else {
			setBalances(getBalancesByChainId(chainId))
		}
	}, [chainId, allBalances, getBalancesByChainId])

	return { balances, isLoading }
}
