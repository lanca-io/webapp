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
	const selectedSrcChain = useStore(state => state.selectedSrcChain)
	const selectedDstChain = useStore(state => state.selectedDstChain)
	const setChains = useStore(state => state.setChains)
	const clearChains = useStore(state => state.clearChains)
	const setLoading = useStore(state => state.setLoading)
	const setError = useStore(state => state.setError)
	const clearError = useStore(state => state.clearError)
	const setSelectedSrcChain = useStore(state => state.setSelectedSrcChain)
	const setSelectedDstChain = useStore(state => state.setSelectedDstChain)

	return {
		chains,
		isLoading,
		error,
		selectedSrcChain,
		selectedDstChain,
		setChains,
		clearChains,
		setLoading,
		setError,
		clearError,
		setSelectedSrcChain,
		setSelectedDstChain,
	}
}
