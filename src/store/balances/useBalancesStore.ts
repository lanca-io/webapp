import { useContext } from 'react'
import { BalancesContext } from './BalancesContext'

export const useBalancesStore = () => {
	const useStore = useContext(BalancesContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <BalancesProvider>.`)
	}

	const balances = useStore(state => state.balances)
	const isLoading = useStore(state => state.isLoading)
	const setBalances = useStore(state => state.setBalances)
	const setIsLoading = useStore(state => state.setIsLoading)
	const getBalancesByChainId = useStore(state => state.getBalancesByChainId)

	return {
		balances,
		isLoading,
		setBalances,
		setIsLoading,
		getBalancesByChainId,
	}
}
