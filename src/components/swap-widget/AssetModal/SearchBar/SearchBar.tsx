import type { SearchBarProps } from './types'
import type { FC } from 'react'
import { useState, useEffect, useCallback } from 'react'
import { TextInput } from '../../../layout/TextInput/TextInput'
import { SearchIcon } from '../../../../assets/icons/SearchIcon'
import { useTokensStore } from '../../../../store/tokens/useTokensStore'
import { useDebounce } from '../../../../hooks/useDebounce'
import { useFormStore } from '../../../../store/form/useFormStore'

export const SearchBar: FC<SearchBarProps> = ({ direction, onSearchActive, onSearchResults }) => {
	const [input, setInput] = useState<string>('')
	const debouncedInputValue = useDebounce(input, 800)
	const { setSrcSearchValue, setDstSearchValue, setAllSearchValue, srcTokens, dstTokens, allTokens } =
		useTokensStore()
	const { srcChain, dstChain } = useFormStore()

	useEffect(() => {
		if (direction === 'from') {
			if (srcChain) {
				setSrcSearchValue(debouncedInputValue)
				onSearchResults(srcTokens.length > 0)
			} else {
				setAllSearchValue(debouncedInputValue)
				onSearchResults(allTokens.length > 0)
			}
		} else {
			if (dstChain) {
				setDstSearchValue(debouncedInputValue)
				onSearchResults(dstTokens.length > 0)
			} else {
				setAllSearchValue(debouncedInputValue)
				onSearchResults(allTokens.length > 0)
			}
		}
		onSearchActive(debouncedInputValue.length > 0)
	}, [
		debouncedInputValue,
		direction,
		srcChain,
		dstChain,
		setSrcSearchValue,
		setDstSearchValue,
		setAllSearchValue,
		srcTokens,
		dstTokens,
		allTokens,
		onSearchActive,
		onSearchResults,
	])

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
