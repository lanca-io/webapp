import type { ILancaChain } from '@lanca/sdk'
import type { ExtendedToken } from '../../../store/tokens/types'
import { memo, useState, useEffect, useCallback } from 'react'
import { TextInput } from '../../layout/input/TextInput'
import { useDebounce } from '../../../hooks/useDebounce'
import { SearchIcon } from '../../../assets/icons/SearchIcon'

type TokenSearchProps = {
	chain: ILancaChain | null
	tokens: ExtendedToken[]
	setSearchValue: (value: string) => void
	onSearchResults: (hasResults: boolean) => void
	onSearchActive: (isActive: boolean) => void
}

export const TokenSearch = memo(
	({ tokens, setSearchValue, onSearchActive, onSearchResults }: TokenSearchProps): JSX.Element => {
		const [input, setInput] = useState('')
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

		return (
			<TextInput
				placeholder="Search by name or paste address"
				value={input}
				onChangeText={handleChange}
				icon={<SearchIcon aria-hidden="true" />}
				aria-label="Search tokens"
			/>
		)
	},
)
