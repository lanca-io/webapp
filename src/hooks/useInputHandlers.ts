import { useCallback } from 'react'
import { ChangeEvent, FocusEvent } from 'react'
import { sanitizeNumbers, sanitizeText } from '../utils/new/input'
import { Mode } from './useInputMode'
import { useFormStore } from '../store/form/useFormStore'

export const useInputHandlers = (
	setValue: (value: string) => void,
	mode: Mode,
	setMode: (mode: Mode) => void,
	determineMode: (input: string) => Mode,
) => {
	const { clearAmount } = useFormStore()

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const inputValue = event.target.value
			const newMode = determineMode(inputValue)

			const sanitizedValue = newMode === Mode.Text ? sanitizeText(inputValue) : sanitizeNumbers(inputValue)

			if (newMode !== mode) {
				setMode(newMode)
			}

			setValue(sanitizedValue)
		},
		[determineMode, mode, setMode, setValue],
	)

	const onFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
		if (e.target.placeholder === '0') {
			e.target.placeholder = ''
		}
	}, [])

	const onBlur = useCallback(
		(e: FocusEvent<HTMLInputElement>) => {
			if (!e.target.value) {
				e.target.placeholder = '0'
				setMode(Mode.None)
				clearAmount()
			}
		},
		[clearAmount, setMode],
	)

	return {
		onChange,
		onFocus,
		onBlur,
	}
}
