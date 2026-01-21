import { useContext } from 'react'
import { PoolsDataContext } from './PoolsDataContext'

export const usePoolsDataStore = () => {
	const useStore = useContext(PoolsDataContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <PoolsStoreProvider>`)
	}

	return {
		supply: useStore(s => s.supply),
		cap: useStore(s => s.cap),
		tvl: useStore(s => s.tvl),
		lpPrice: useStore(s => s.lpPrice),
		isLoading: useStore(s => s.isLoading),
		setMetrics: useStore(s => s.setMetics),
		setIsLoading: useStore(s => s.setIsLoading),
	}
}
