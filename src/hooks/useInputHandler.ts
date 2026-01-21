import type { ChangeEvent, FocusEvent } from 'react'
import { useCallback, useState } from 'react'
import { sanitizeNumbers } from '../utils/input'

export const useInputHandler = () => {
	const [value, setValue] = useState<string>('')
	const [isFocused, setIsFocused] = useState<boolean>(false)

	const isValidNumber = (input: string) => /^\d*\.?\d*$/.test(input)

	const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
		const input = event.target.value
		if (isValidNumber(input)) {
			setValue(sanitizeNumbers(input))
		}
	}, [])

	const onFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
		setIsFocused(true)
		if (e.target.placeholder === '0') {
			e.target.placeholder = ''
		}
	}, [])

	const onBlur = useCallback((e: FocusEvent<HTMLInputElement>) => {
		setIsFocused(false)
		if (!e.target.value) {
			e.target.placeholder = '0'
		}
	}, [])

	return {
		value,
		isFocused,
		onChange,
		onFocus,
		onBlur,
	}
}
