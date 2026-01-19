import { useContext } from 'react'
import { PoolsContext } from './PoolsContext'

export const usePoolsStore = () => {
	const useStore = useContext(PoolsContext)
	if (!useStore) {
		throw new Error(
			`You forgot to wrap your component in <ChainsStoreProvider>.`,
		)
	}

	const balance = useStore(state => state.balance)
	const usdBalance = useStore(state => state.usdBalance)
	const principal = useStore(state => state.principal)
	const supply = useStore(state => state.supply)
	const cap = useStore(state => state.cap)
	const tvl = useStore(state => state.tvl)
	const isSupplyLoading = useStore(state => state.isSupplyLoading)
	const isCapLoading = useStore(state => state.isCapLoading)
	const isTvlLoading = useStore(state => state.isTvlLoading)
	const isBalanceLoading = useStore(state => state.isBalanceLoading)
	const setSupply = useStore(state => state.setSupply)
	const setCap = useStore(state => state.setCap)
	const setTvl = useStore(state => state.setTvl)
	const setBalance = useStore(state => state.setBalance)
	const setPrincipal = useStore(state => state.setPrincipal)
	const setIsSupplyLoading = useStore(state => state.setIsSupplyLoading)
	const setIsCapLoading = useStore(state => state.setIsCapLoading)
	const setIsTvlLoading = useStore(state => state.setIsTvlLoading)
	const setIsBalanceLoading = useStore(state => state.setIsBalanceLoading)

	return {
		balance,
		usdBalance,
		principal,
		supply,
		cap,
		tvl,
		isSupplyLoading,
		isCapLoading,
		isTvlLoading,
		isBalanceLoading,
		setSupply,
		setCap,
		setTvl,
		setBalance,
		setPrincipal,
		setIsSupplyLoading,
		setIsCapLoading,
		setIsTvlLoading,
		setIsBalanceLoading,
	}
}
