import type { ILancaChain } from '@lanca/sdk'
import { useMemo } from 'react'
import { useTokensStore } from '../store/tokens/useTokensStore'

export const useTokenSelection = (selectedChain: ILancaChain | null) => {
	const {
		tokens,
		allTokens,
		searchedTokens,
		allSearchedTokens,
		isLoading,
		allTokensLoading,
		offset,
		allOffset,
		setOffset,
		setAllOffset,
	} = useTokensStore()

	const tokensList = useMemo(() => (selectedChain ? tokens : allTokens), [selectedChain, tokens, allTokens])

	const searchResults = useMemo(
		() => (selectedChain ? searchedTokens : allSearchedTokens),
		[selectedChain, searchedTokens, allSearchedTokens],
	)

	const isDataLoading = useMemo(
		() => (selectedChain ? isLoading : allTokensLoading),
		[selectedChain, isLoading, allTokensLoading],
	)

	const currentPage = useMemo(() => (selectedChain ? offset : allOffset), [selectedChain, offset, allOffset])

	const setPage = useMemo(
		() => (newOffset: number) => {
			if (selectedChain) {
				setOffset(newOffset)
			} else {
				setAllOffset(newOffset)
			}
		},
		[selectedChain, setOffset, setAllOffset],
	)

	return {
		tokens: tokensList,
		searchTokens: searchResults,
		isLoading: isDataLoading,
		offset: currentPage,
		setOffset: setPage,
	}
}
