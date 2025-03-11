import { useTokensStore as Store } from './TokensStore'

export const useTokensStore = () => {
	const tokens = Store(state => state.tokens)
	const isLoading = Store(state => state.isLoading)
	const error = Store(state => state.error)
	const offset = Store(state => state.offset)
	const searchValue = Store(state => state.searchValue)
	const setTokens = Store(state => state.setTokens)
	const setLoading = Store(state => state.setLoading)
	const setError = Store(state => state.setError)
	const setOffset = Store(state => state.setOffset)
	const setSearchValue = Store(state => state.setSearchValue)
	const clearTokens = Store(state => state.clearTokens)

	return {
		tokens,
		isLoading,
		error,
		offset,
		searchValue,
		setTokens,
		setLoading,
		setError,
		setOffset,
		setSearchValue,
		clearTokens,
	}
}
