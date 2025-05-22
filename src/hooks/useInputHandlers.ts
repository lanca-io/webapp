import type { ChangeEvent, FocusEvent } from 'react'
import { useCallback, useEffect } from 'react'
import { sanitizeNumbers, sanitizeText } from '../utils/new/input'
import { Mode } from '../store/form/types'
import { useFormStore } from '../store/form/useFormStore'
import { useTextInputValidator } from './useTextInputValidator'
import { useNumberInputValidator } from './useNumberInputValidator'
import { usePercentInputValidator } from './usePercentInputValidator'
import { useDollarInputValidator } from './useDollarInputValidator'
import { useAccount } from 'wagmi'

export const useInputHandlers = () => {
	const { isConnected } = useAccount()
	const {
		fromToken,
		amountInput,
		amountInputMode,
		setAmountInput,
		setAmountInputMode,
		clearInputs,
		setAmountInputFocused,
	} = useFormStore()

	const textValidator = useTextInputValidator(amountInput, fromToken)
	const numberValidator = useNumberInputValidator(amountInput, fromToken)
	const percentValidator = usePercentInputValidator(amountInput, fromToken)
	const dollarValidator = useDollarInputValidator(amountInput, fromToken)

	const determineMode = useCallback((input: string, connected: boolean): Mode => {
		if (!input) return Mode.None
		if (input.includes('$')) return Mode.Dollar

		if (!connected) {
			return Mode.Number
		}

		if (/^[a-zA-Z]+$/.test(input)) return Mode.Text
		if (input.includes('%')) return Mode.Percent
		return Mode.Number
	}, [])

	const validateInput = useCallback(() => {
		if (amountInputMode === Mode.None) return

		if (!isConnected) {
			if (amountInputMode === Mode.Number) {
				numberValidator()
			} else if (amountInputMode === Mode.Dollar) {
				dollarValidator()
			}
			return
		}

		const validator = {
			[Mode.Text]: textValidator,
			[Mode.Number]: numberValidator,
			[Mode.Percent]: percentValidator,
			[Mode.Dollar]: dollarValidator,
		}[amountInputMode]

		validator()
	}, [amountInputMode, textValidator, numberValidator, percentValidator, dollarValidator, isConnected])

	useEffect(() => {
		const mode = determineMode(amountInput, isConnected)
		if (mode !== amountInputMode) {
			setAmountInputMode(mode)
		}
		validateInput()
	}, [amountInput, amountInputMode, determineMode, setAmountInputMode, validateInput, isConnected])

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value

			if (!isConnected) {
				if (value.includes('$')) {
					const sanitizedValue = sanitizeNumbers(value.replace('$', ''))
					setAmountInput('$' + sanitizedValue)
				} else {
					const sanitizedValue = sanitizeNumbers(value)
					setAmountInput(sanitizedValue)
				}
				return
			}

			const sanitizedValue = /^[a-zA-Z]+$/.test(value) ? sanitizeText(value) : sanitizeNumbers(value)
			setAmountInput(sanitizedValue)
		},
		[setAmountInput, isConnected],
	)

	const onFocus = useCallback(
		(e: FocusEvent<HTMLInputElement>) => {
			if (e.target.placeholder === '0') {
				e.target.placeholder = ''
				setAmountInputFocused(true)
			}
		},
		[setAmountInputFocused],
	)

	const onBlur = useCallback(
		(e: FocusEvent<HTMLInputElement>) => {
			if (!e.target.value) {
				e.target.placeholder = '0'
				clearInputs()
			}
		},
		[clearInputs],
	)

	return {
		onChange,
		onFocus,
		onBlur,
	}
}
