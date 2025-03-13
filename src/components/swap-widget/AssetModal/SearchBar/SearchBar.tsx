import type { FC } from 'react'
import { useState, useEffect, useCallback } from 'react'
import { TextInput } from '../../../layout/TextInput/TextInput'
import { SearchIcon } from '../../../../assets/icons/SearchIcon'
import { useTokensStore } from '../../../../store/tokens/useTokensStore'
import { useDebounce } from '../../../../hooks/useDebounce'

export const SearchBar: FC = () => {
	const [input, setInput] = useState<string>('')
	const debouncedInputValue = useDebounce(input, 800)
	const { setSrcSearchValue } = useTokensStore()

	useEffect(() => {
		setSrcSearchValue(debouncedInputValue)
	}, [debouncedInputValue, setSrcSearchValue])

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
