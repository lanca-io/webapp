import type { FC } from 'react'
import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../../store/tokens/types'
import { useState, useEffect, useCallback, useMemo } from 'react'
import { TextInput } from '../../components/layout/input/TextInput'
import { useDebounce } from '../../hooks/useDebounce'
import { SearchIcon } from '../../assets/icons/SearchIcon'

type SearchProps = {
	chain: ILancaChain | null
	tokens: ExtendedToken[]
	setSearchValue: (value: string) => void
	onSearchResults: (hasResults: boolean) => void
	onSearchActive: (isActive: boolean) => void
}

export const TokenSearch: FC<SearchProps> = ({ tokens, setSearchValue, onSearchActive, onSearchResults }) => {
	const [input, setInput] = useState<string>('')
	const debouncedInputValue = useDebounce(input, 500)

	useEffect(() => {
		const hasResults = tokens.length > 0
		const isActive = debouncedInputValue.length > 0

		setSearchValue(debouncedInputValue)
		onSearchResults(hasResults)
		onSearchActive(isActive)
	}, [debouncedInputValue, tokens.length, setSearchValue, onSearchResults, onSearchActive])

	const handleChange = useCallback((value: string) => {
		setInput(value)
	}, [])

	const searchIcon = useMemo(() => <SearchIcon />, [])

	const searchInput = useMemo(
		() => (
			<TextInput
				placeholder="Search by name or paste address"
				value={input}
				onChangeText={handleChange}
				icon={searchIcon}
				aria-label="Search tokens"
			/>
		),
		[input, handleChange, searchIcon],
	)

	return searchInput
}
