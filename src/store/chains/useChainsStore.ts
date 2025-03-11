import { useChainStore } from './ChainsStore'
import { useChainActions } from './useChainActions'

export const useChainsStore = () => {
	const { selectChain, clearSelectedChain } = useChainActions()
	const chains = useChainStore(state => state.chains)
	const isLoading = useChainStore(state => state.isLoading)
	const error = useChainStore(state => state.error)
	const selectedChain = useChainStore(state => state.selectedChain)
	const setChains = useChainStore(state => state.setChains)
	const setError = useChainStore(state => state.setError)
	const setLoading = useChainStore(state => state.setLoading)
	const clearChains = useChainStore(state => state.clearChains)
	const clearError = useChainStore(state => state.clearError)

	return {
		chains,
		isLoading,
		error,
		selectedChain,
		setChains,
		setError,
		setLoading,
		clearChains,
		clearError,
		selectChain,
		clearSelectedChain,
	}
}
