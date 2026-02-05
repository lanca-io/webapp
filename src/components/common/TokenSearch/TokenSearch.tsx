import type { ExtendedToken } from '../../../store/tokens/types'
import { memo, useState, useEffect, useCallback } from 'react'
import { Input } from '@concero/ui-kit'
import { useDebounce } from '../../../hooks/useDebounce'
import { SearchIcon } from '@/assets/SearchIcon'
import { ConceroChain } from '../../../store/chains/types'

type TokenSearchProps = {
	chain: ConceroChain | null
	tokens: ExtendedToken[]
	setSearchValue: (value: string) => void
	onSearchResults: (hasResults: boolean) => void
	onSearchActive: (isActive: boolean) => void
}

export const TokenSearch = memo(
	({
		tokens,
		setSearchValue,
		onSearchActive,
		onSearchResults,
	}: TokenSearchProps): JSX.Element => {
		const [input, setInput] = useState('')
		const debouncedInputValue = useDebounce(input, 500)

		useEffect(() => {
			const hasResults = tokens.length > 0
			const isActive = debouncedInputValue.length > 0

			setSearchValue(debouncedInputValue)
			onSearchResults(hasResults)
			onSearchActive(isActive)
		}, [
			debouncedInputValue,
			tokens.length,
			setSearchValue,
			onSearchResults,
			onSearchActive,
		])

		const handleChange = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				setInput(e.target.value)
			},
			[],
		)

		return (
			<Input
				placeholder="Search by name or paste address"
				value={input}
				onChange={handleChange}
				icon={<SearchIcon aria-hidden="true" />}
				aria-label="Search tokens"
			/>
		)
	},
)
