import { useContext } from 'react'
import { BalancesContext } from './BalancesContext'

export const useBalancesStore = () => {
	const useStore = useContext(BalancesContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <BalancesProvider>.`)
	}

	const srcBalances = useStore(state => state.srcBalances)
	const dstBalances = useStore(state => state.dstBalances)
	const setSrcBalances = useStore(state => state.setSrcBalances)
	const setDstBalances = useStore(state => state.setDstBalances)
	const clearSrcBalances = useStore(state => state.clearSrcBalances)
	const clearDstBalances = useStore(state => state.clearDstBalances)
	const isLoadingSrcBalances = useStore(state => state.isLoadingSrcBalances)
	const isLoadingDstBalances = useStore(state => state.isLoadingDstBalances)
	const setLoadingSrcBalances = useStore(state => state.setLoadingSrcBalances)
	const setLoadingDstBalances = useStore(state => state.setLoadingDstBalances)

	return {
		srcBalances,
		dstBalances,
		setSrcBalances,
		setDstBalances,
		clearSrcBalances,
		clearDstBalances,
		isLoadingSrcBalances,
		isLoadingDstBalances,
		setLoadingDstBalances,
		setLoadingSrcBalances,
	}
}
