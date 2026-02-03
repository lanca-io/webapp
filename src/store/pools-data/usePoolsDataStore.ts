import { useContext } from 'react'
import { PoolsDataContext } from './PoolsDataContext'

export const usePoolsDataStore = () => {
	const useStore = useContext(PoolsDataContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <PoolsStoreProvider>`)
	}

	return {
		lp_supply: useStore(s => s.lp_supply),
		cap: useStore(s => s.cap),
		tvl: useStore(s => s.tvl),
		minDeposit: useStore(s => s.minDeposit),
		minWithdrawal: useStore(s => s.minWithdrawal),
		lpPrice: useStore(s => s.lpPrice),
		isLoading: useStore(s => s.isLoading),
		setMetrics: useStore(s => s.setMetics),
		setIsLoading: useStore(s => s.setIsLoading),
	}
}
