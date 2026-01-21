import { useContext } from 'react'
import { PoolsUserBalancesContext } from './PoolsUserBalancesContext'

export const usePoolsUserBalancesStore = () => {
	const useStore = useContext(PoolsUserBalancesContext)
	if (!useStore) {
		throw new Error(
			`You forgot to wrap your component in <RoutesStoreProvider>.`,
		)
	}

	const usd = useStore(state => state.usd)
	const lp = useStore(state => state.lp)
	const rawUsd = useStore(state => state.rawUsd)
	const rawLp = useStore(state => state.rawLp)
	const isLoading = useStore(state => state.isLoading)
	const setBalances = useStore(state => state.setBalances)
	const setIsLoading = useStore(state => state.setIsLoading)

	return {
		usd,
		lp,
		rawUsd,
		rawLp,
		isLoading,
		setBalances,
		setIsLoading,
	}
}
