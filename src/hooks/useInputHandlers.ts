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
import { useDebounce } from '../hooks/useDebounce'

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
		setAmountInputError,
		setFromAmount,
	} = useFormStore()

	const debouncedAmountInput = useDebounce(amountInput, 800)

	const isInputEmpty = !amountInput.trim()

	const textValidator = useTextInputValidator(debouncedAmountInput, fromToken)
	const numberValidator = useNumberInputValidator(debouncedAmountInput, fromToken)
	const percentValidator = usePercentInputValidator(debouncedAmountInput, fromToken)
	const dollarValidator = useDollarInputValidator(debouncedAmountInput, fromToken)

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
		if (isInputEmpty) {
			setAmountInputError(null)
			return
		}

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
	}, [
		amountInputMode,
		textValidator,
		numberValidator,
		percentValidator,
		dollarValidator,
		isConnected,
		isInputEmpty,
		setAmountInputError,
	])

	useEffect(() => {
		if (isInputEmpty) {
			setAmountInputError(null)
			setFromAmount(null)
			return
		}

		const mode = determineMode(debouncedAmountInput, isConnected)
		if (mode !== amountInputMode) {
			setAmountInputMode(mode)
		}
		validateInput()
	}, [
		debouncedAmountInput,
		amountInputMode,
		determineMode,
		setAmountInputMode,
		validateInput,
		isConnected,
		isInputEmpty,
		setAmountInputError,
	])

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value

			if (!value.trim()) {
				setAmountInputError(null)
			}

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
		[setAmountInput, setAmountInputError, isConnected],
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
