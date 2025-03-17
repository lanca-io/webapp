import { useContext } from 'react'
import { ChainsContext } from './ChainsContext'

export const useChainsStore = () => {
	const useStore = useContext(ChainsContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <ChainsStoreProvider>.`)
	}

	const chains = useStore(state => state.chains)
	const isLoading = useStore(state => state.isLoading)
	const error = useStore(state => state.error)
	const setChains = useStore(state => state.setChains)
	const clearChains = useStore(state => state.clearChains)
	const setLoading = useStore(state => state.setLoading)
	const setError = useStore(state => state.setError)
	const clearError = useStore(state => state.clearError)

	return {
		chains,
		isLoading,
		error,
		setChains,
		clearChains,
		setLoading,
		setError,
		clearError,
	}
}
