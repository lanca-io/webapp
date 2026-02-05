import { useContext } from 'react'
import { PoolsPositionsContext } from './PoolsPositionsContext'

export const usePoolsPositions = () => {
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
	const balancesLoading = useStore(state => state.balancesLoading)

	const actions = useStore(state => state.actions)
	const initialActionsLoading = useStore(state => state.initialActionsLoading)
	const dataActionsLoading = useStore(state => state.dataActionsLoading)
	const actionsPagination = useStore(state => state.actionsPagination)

	const setBalances = useStore(state => state.setBalances)
	const setBalancesLoading = useStore(state => state.setBalancesLoading)
	const setActions = useStore(state => state.setActions)
	const addActions = useStore(state => state.addActions)
	const setActionsLoading = useStore(state => state.setActionsLoading)
	const setActionsPagination = useStore(state => state.setActionsPagination)
	const resetActions = useStore(state => state.resetActions)

	return {
		usd,
		lp,
		rawUsd,
		rawLp,
		balancesLoading,

		actions,
		initialActionsLoading,
		dataActionsLoading,
		actionsPagination,

		setBalances,
		setBalancesLoading,
		setActions,
		addActions,
		setActionsLoading,
		setActionsPagination,
		resetActions,
	}
}
