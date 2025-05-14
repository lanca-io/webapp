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
	const { fromToken, amountInput, amountInputMode, setAmountInput, setAmountInputMode, clearInputs } = useFormStore()

	const textValidator = useTextInputValidator(amountInput, fromToken)
	const numberValidator = useNumberInputValidator(amountInput, fromToken)
	const percentValidator = usePercentInputValidator(amountInput, fromToken)
	const dollarValidator = useDollarInputValidator(amountInput, fromToken)

	const determineMode = useCallback((input: string): Mode => {
		if (!input) return Mode.None
		if (/^[a-zA-Z]+$/.test(input)) return Mode.Text
		if (input.includes('%')) return Mode.Percent
		if (input.includes('$')) return Mode.Dollar
		return Mode.Number
	}, [])

	const validateInput = useCallback(() => {
		if (!isConnected) return
		if (amountInputMode === Mode.None) return

		const validator = {
			[Mode.Text]: textValidator,
			[Mode.Number]: numberValidator,
			[Mode.Percent]: percentValidator,
			[Mode.Dollar]: dollarValidator,
		}[amountInputMode]

		validator()
	}, [amountInputMode, textValidator, numberValidator, percentValidator, dollarValidator, isConnected])

	useEffect(() => {
		const mode = determineMode(amountInput)
		if (mode !== amountInputMode) {
			setAmountInputMode(mode)
		}
		if (isConnected) {
			validateInput()
		}
	}, [amountInput, amountInputMode, determineMode, setAmountInputMode, validateInput, isConnected])

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value
			const sanitizedValue = /^[a-zA-Z]+$/.test(value) ? sanitizeText(value) : sanitizeNumbers(value)
			setAmountInput(sanitizedValue)
		},
		[setAmountInput],
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
