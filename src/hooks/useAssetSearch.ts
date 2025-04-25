import type { ILancaChain } from '@lanca/sdk'
import { useState, useCallback } from 'react'
import { useTokensStore } from '../store/tokens/useTokensStore'

export const useAssetSearch = (chain: ILancaChain | null) => {
	const [isActive, setIsActive] = useState<boolean>(false)
	const [hasResults, setHasResults] = useState<boolean>(true)

	const { setSearchValue, setAllSearchValue } = useTokensStore()

	const updateSearch = useCallback(
		(value: string) => {
			const setter = chain ? setSearchValue : setAllSearchValue
			setter(value)
		},
		[chain, setSearchValue, setAllSearchValue],
	)

	const setActive = useCallback((active: boolean) => {
		setIsActive(active)
	}, [])

	const setResults = useCallback((hasResults: boolean) => {
		setHasResults(hasResults)
	}, [])

	return {
		isActive,
		hasResults,
		setActive,
		setResults,
		updateSearch,
	}
}
