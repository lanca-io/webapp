import { useContext } from 'react'
import { ChainsContext } from './ChainsContext'

export const useChainsStore = () => {
	const useStore = useContext(ChainsContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <ChainsStoreProvider>.`)
	}

	const chains = useStore(state => state.chains)
	const isLoading = useStore(state => state.isLoading)
	const setChains = useStore(state => state.setChains)
	const clearChains = useStore(state => state.clearChains)
	const setLoading = useStore(state => state.setLoading)
	const getChainById = useStore(state => state.getChainById)

	return {
		chains,
		isLoading,
		setChains,
		clearChains,
		setLoading,
		getChainById,
	}
}
