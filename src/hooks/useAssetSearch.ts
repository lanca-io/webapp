import type { ILancaChain } from '@lanca/sdk'
import { useState, useCallback, useMemo } from 'react'
import { useTokensStore } from '../store/tokens/useTokensStore'

type SearchResult = {
	isActive: boolean
	hasResults: boolean
	setActive: (active: boolean) => void
	setResults: (hasResults: boolean) => void
	updateSearch: (value: string) => void
}

export const useAssetSearch = (chain: ILancaChain | null): SearchResult => {
	const [isActive, setIsActive] = useState<boolean>(false)
	const [hasResults, setHasResults] = useState<boolean>(true)

	const { setSearchValue, setAllSearchValue } = useTokensStore()

	const updateSearch = useCallback(
		(value: string): void => {
			const setter = chain ? setSearchValue : setAllSearchValue
			setter(value)
		},
		[chain, setSearchValue, setAllSearchValue],
	)

	const setActive = useCallback((active: boolean): void => {
		setIsActive(active)
	}, [])

	const setResults = useCallback((hasResults: boolean): void => {
		setHasResults(hasResults)
	}, [])

	return useMemo(
		() => ({
			isActive,
			hasResults,
			setActive,
			setResults,
			updateSearch,
		}),
		[isActive, hasResults, setActive, setResults, updateSearch],
	)
}
