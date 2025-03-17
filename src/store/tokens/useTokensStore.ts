import { useContext } from 'react'
import { TokensContext } from './TokensContext'

export const useTokensStore = () => {
	const useStore = useContext(TokensContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <TokensStoreProvider>.`)
	}

	const srcTokens = useStore(state => state.srcTokens)
	const srcSearchedTokens = useStore(state => state.srcSearchedTokens)
	const srcTokensLoading = useStore(state => state.srcTokensLoading)
	const srcSearchValue = useStore(state => state.srcSearchValue)
	const srcOffset = useStore(state => state.srcOffset)
	const setSrcTokens = useStore(state => state.setSrcTokens)
	const addSrcTokens = useStore(state => state.addSrcTokens)
	const setSrcTokensLoading = useStore(state => state.setSrcTokensLoading)
	const setSrcSearchValue = useStore(state => state.setSrcSearchValue)
	const setSrcOffset = useStore(state => state.setSrcOffset)
	const clearSrcTokens = useStore(state => state.clearSrcTokens)
	const setSrcSearchedTokens = useStore(state => state.setSrcSearchedTokens)
	const addSrcSearchedTokens = useStore(state => state.addSrcSearchedTokens)
	const clearSrcSearchedTokens = useStore(state => state.clearSrcSearchedTokens)

	const dstTokens = useStore(state => state.dstTokens)
	const dstSearchedTokens = useStore(state => state.dstSearchedTokens)
	const dstTokensLoading = useStore(state => state.dstTokensLoading)
	const dstSearchValue = useStore(state => state.dstSearchValue)
	const dstOffset = useStore(state => state.dstOffset)
	const setDstTokens = useStore(state => state.setDstTokens)
	const addDstTokens = useStore(state => state.addDstTokens)
	const setDstTokensLoading = useStore(state => state.setDstTokensLoading)
	const setDstSearchValue = useStore(state => state.setDstSearchValue)
	const setDstOffset = useStore(state => state.setDstOffset)
	const clearDstTokens = useStore(state => state.clearDstTokens)
	const setDstSearchedTokens = useStore(state => state.setDstSearchedTokens)
	const addDstSearchedTokens = useStore(state => state.addDstSearchedTokens)
	const clearDstSearchedTokens = useStore(state => state.clearDstSearchedTokens)

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
		srcTokens,
		srcSearchedTokens,
		srcTokensLoading,
		srcSearchValue,
		srcOffset,
		setSrcTokens,
		addSrcTokens,
		setSrcTokensLoading,
		setSrcSearchValue,
		setSrcOffset,
		clearSrcTokens,
		setSrcSearchedTokens,
		addSrcSearchedTokens,
		clearSrcSearchedTokens,
		dstTokens,
		dstSearchedTokens,
		dstTokensLoading,
		dstSearchValue,
		dstOffset,
		setDstTokens,
		addDstTokens,
		setDstTokensLoading,
		setDstSearchValue,
		setDstOffset,
		clearDstTokens,
		setDstSearchedTokens,
		addDstSearchedTokens,
		clearDstSearchedTokens,
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
