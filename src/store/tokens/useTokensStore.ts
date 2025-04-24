import { useContext } from 'react'
import { TokensContext } from './TokensContext'

export const useTokensStore = () => {
	const useStore = useContext(TokensContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <TokensStoreProvider>.`)
	}

	const tokens = useStore(state => state.tokens)
	const searchedTokens = useStore(state => state.searchedTokens)
	const isLoading = useStore(state => state.isLoading)
	const searchValue = useStore(state => state.searchValue)
	const offset = useStore(state => state.offset)
	const setTokens = useStore(state => state.setTokens)
	const addTokens = useStore(state => state.addTokens)
	const setLoading = useStore(state => state.setLoading)
	const setSearchValue = useStore(state => state.setSearchValue)
	const setOffset = useStore(state => state.setOffset)
	const clearTokens = useStore(state => state.clearTokens)
	const setSearchedTokens = useStore(state => state.setSearchedTokens)
	const addSearchedTokens = useStore(state => state.addSearchedTokens)
	const clearSearchedTokens = useStore(state => state.clearSearchedTokens)

	const allTokens = useStore(state => state.allTokens)
	const allSearchedTokens = useStore(state => state.allSearchedTokens)
	const allTokensLoading = useStore(state => state.allTokensLoading)
	const allSearchValue = useStore(state => state.allSearchValue)
	const allOffset = useStore(state => state.allOffset)
	const setAllTokens = useStore(state => state.setAllTokens)
	const addAllTokens = useStore(state => state.addAllTokens)
	const setAllTokensLoading = useStore(state => state.setAllTokensLoading)
	const setAllSearchValue = useStore(state => state.setAllSearchValue)
	const setAllOffset = useStore(state => state.setAllOffset)
	const clearAllTokens = useStore(state => state.clearAllTokens)
	const setAllSearchedTokens = useStore(state => state.setAllSearchedTokens)
	const addAllSearchedTokens = useStore(state => state.addAllSearchedTokens)
	const clearAllSearchedTokens = useStore(state => state.clearAllSearchedTokens)

	return {
		tokens,
		searchedTokens,
		isLoading,
		searchValue,
		offset,
		setTokens,
		addTokens,
		setLoading,
		setSearchValue,
		setOffset,
		clearTokens,
		setSearchedTokens,
		addSearchedTokens,
		clearSearchedTokens,

		allTokens,
		allSearchedTokens,
		allTokensLoading,
		allSearchValue,
		allOffset,
		setAllTokens,
		addAllTokens,
		setAllTokensLoading,
		setAllSearchValue,
		setAllOffset,
		clearAllTokens,
		setAllSearchedTokens,
		addAllSearchedTokens,
		clearAllSearchedTokens,
	}
}
