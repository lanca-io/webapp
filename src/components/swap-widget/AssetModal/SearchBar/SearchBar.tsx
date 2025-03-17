import type { SearchBarProps } from './types'
import { type FC, useState, useEffect, useCallback } from 'react'
import { TextInput } from '../../../layout/TextInput/TextInput'
import { SearchIcon } from '../../../../assets/icons/SearchIcon'
import { useDebounce } from '../../../../hooks/useDebounce'

export const SearchBar: FC<SearchBarProps> = ({ tokens, setSearchValue, onSearchActive, onSearchResults }) => {
	const [input, setInput] = useState<string>('')
	const debouncedInputValue = useDebounce(input, 900)

	useEffect(() => {
		setSearchValue(debouncedInputValue)
		onSearchResults(tokens.length > 0)
		onSearchActive(debouncedInputValue.length > 0)
	}, [debouncedInputValue, setSearchValue, tokens, onSearchResults, onSearchActive])

	const handleChange = useCallback((value: string) => {
		setInput(value)
	}, [])

	return (
		<TextInput
			placeholder="Search by name or paste address"
			value={input}
			onChangeText={handleChange}
			icon={<SearchIcon />}
		/>
	)
}
