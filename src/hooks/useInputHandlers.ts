import type { ChangeEvent, FocusEvent } from 'react'
import { useCallback, useEffect } from 'react'
import { sanitizeNumbers, sanitizeText } from '../utils/new/input'
import { Mode } from '../store/form/types'
import { useFormStore } from '../store/form/useFormStore'
import { useTextInputValidator } from './useTextInputValidator'
import { useNumberInputValidator } from './useNumberInputValidator'
import { usePercentInputValidator } from './usePercentInputValidator'
import { useDollarInputValidator } from './useDollarInputValidator'

export const useInputHandlers = () => {
	const { sourceToken, inputValue, inputMode, setInputValue, setInputMode, clearInput } = useFormStore()

	const textValidator = useTextInputValidator(inputValue, sourceToken)
	const numberValidator = useNumberInputValidator(inputValue, sourceToken)
	const percentValidator = usePercentInputValidator(inputValue)
	const dollarValidator = useDollarInputValidator(inputValue, sourceToken)

	const determineMode = useCallback((input: string): Mode => {
		if (!input) return Mode.None
		if (/^[a-zA-Z]+$/.test(input)) return Mode.Text
		if (input.includes('%')) return Mode.Percent
		if (input.includes('$')) return Mode.Dollar
		return Mode.Number
	}, [])

	const validateInput = useCallback(() => {
		if (inputMode === Mode.None) return

		const validator = {
			[Mode.Text]: textValidator,
			[Mode.Number]: numberValidator,
			[Mode.Percent]: percentValidator,
			[Mode.Dollar]: dollarValidator,
		}[inputMode]

		validator()
	}, [inputMode, textValidator, numberValidator, percentValidator, dollarValidator])

	useEffect(() => {
		const mode = determineMode(inputValue)
		if (mode !== inputMode) {
			setInputMode(mode)
		}
		validateInput()
	}, [inputValue, inputMode, determineMode, setInputMode, validateInput])

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value
			const sanitizedValue = /^[a-zA-Z]+$/.test(value) ? sanitizeText(value) : sanitizeNumbers(value)

			setInputValue(sanitizedValue)
		},
		[setInputValue],
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
				clearInput()
			}
		},
		[clearInput],
	)

	return {
		onChange,
		onFocus,
		onBlur,
	}
}
