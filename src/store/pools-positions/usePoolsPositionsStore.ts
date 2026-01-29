import { useContext } from 'react'
import { PoolsPositionsContext } from './PoolsPositionsContext'

export const usePoolsUserBalancesStore = () => {
	const useStore = useContext(PoolsPositionsContext)
	if (!useStore) {
		throw new Error(
			`You forgot to wrap your component in <PoolsPositionsProvider>.`,
		)
	}

	const usd = useStore(state => state.usd)
	const lp = useStore(state => state.lp)
	const rawUsd = useStore(state => state.rawUsd)
	const rawLp = useStore(state => state.rawLp)
	const areBalancesLoading = useStore(state => state.areBalancesLoading)
	const setBalances = useStore(state => state.setBalances)
	const setBalancesLoading = useStore(state => state.setBalancesLoading)

	return {
		usd,
		lp,
		rawUsd,
		rawLp,
		areBalancesLoading,
		setBalances,
		setBalancesLoading,
	}
}
