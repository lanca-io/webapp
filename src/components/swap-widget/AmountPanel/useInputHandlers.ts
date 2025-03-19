import { useCallback } from 'react'
import { ChangeEvent, FocusEvent } from 'react'
import { sanitizeNumbers, sanitizeText } from '../../../utils/new/input'
import { Mode } from './types'
import { useFormStore } from '../../../store/form/useFormStore'

export const useInputHandlers = (
	setValue: (value: string) => void,
	mode: Mode,
	setMode: (mode: Mode) => void,
	determineMode: (input: string) => Mode,
) => {
	const { clearAmount } = useFormStore()

	const handleChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			let value = event.target.value
			const newMode = determineMode(value)
			if (newMode === Mode.Text) {
				value = sanitizeText(value)
			} else {
				value = sanitizeNumbers(value)
			}
			if (newMode !== mode) {
				setMode(newMode)
			}
			setValue(value)
		},
		[determineMode, mode, setMode, setValue],
	)

	const handleFocus = useCallback((e: FocusEvent<HTMLInputElement>) => {
		if (e.target.placeholder === '0') {
			e.target.placeholder = ''
		}
	}, [])

	const handleBlur = useCallback(
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
		handleChange,
		handleFocus,
		handleBlur,
	}
}
