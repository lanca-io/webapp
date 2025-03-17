import { useContext } from 'react'
import { BalancesContext } from './BalancesContext'

export const useBalancesStore = () => {
	const useStore = useContext(BalancesContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <BalancesProvider>.`)
	}

	const balances = useStore(state => state.balances)
	const isLoadingBalances = useStore(state => state.isLoadingBalances)
	const setBalances = useStore(state => state.setBalances)
	const setLoadingBalances = useStore(state => state.setLoadingBalances)
	const filterTokensByChain = useStore(state => state.filterTokensByChain)

	return {
		balances,
		isLoadingBalances,
		setBalances,
		setLoadingBalances,
		filterTokensByChain,
	}
}
