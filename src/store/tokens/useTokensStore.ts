import { useContext } from 'react'
import { TokensContext } from './TokensContext'

export const useTokensStore = () => {
	const useStore = useContext(TokensContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <TokensStoreProvider>.`)
	}

	const srcTokens = useStore(state => state.srcTokens)
	const srcTokensLoading = useStore(state => state.srcTokensLoading)
	const srcSearchValue = useStore(state => state.srcSearchValue)
	const srcOffset = useStore(state => state.srcOffset)
	const setSrcTokens = useStore(state => state.setSrcTokens)
	const setSrcTokensLoading = useStore(state => state.setSrcTokensLoading)
	const setSrcSearchValue = useStore(state => state.setSrcSearchValue)
	const setSrcOffset = useStore(state => state.setSrcOffset)
	const clearSrcTokens = useStore(state => state.clearSrcTokens)

	const dstTokens = useStore(state => state.dstTokens)
	const dstTokensLoading = useStore(state => state.dstTokensLoading)
	const dstSearchValue = useStore(state => state.dstSearchValue)
	const dstOffset = useStore(state => state.dstOffset)
	const setDstTokens = useStore(state => state.setDstTokens)
	const setDstTokensLoading = useStore(state => state.setDstTokensLoading)
	const setDstSearchValue = useStore(state => state.setDstSearchValue)
	const setDstOffset = useStore(state => state.setDstOffset)
	const clearDstTokens = useStore(state => state.clearDstTokens)

	return {
		srcTokens,
		srcTokensLoading,
		srcSearchValue,
		srcOffset,
		setSrcTokens,
		setSrcTokensLoading,
		setSrcSearchValue,
		setSrcOffset,
		clearSrcTokens,
		dstTokens,
		dstTokensLoading,
		dstSearchValue,
		dstOffset,
		setDstTokens,
		setDstTokensLoading,
		setDstSearchValue,
		setDstOffset,
		clearDstTokens,
	}
}
