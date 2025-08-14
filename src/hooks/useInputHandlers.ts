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
import { useDebounce } from './useDebounce'
import { useRouteStore } from '../store/route/useRouteStore'

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

	const { setError } = useRouteStore()

	const debouncedAmountInput = useDebounce(amountInput, 800)
	const isInputEmpty = !amountInput.trim()

	const textValidator = useTextInputValidator(debouncedAmountInput, fromToken)
	const numberValidator = useNumberInputValidator(debouncedAmountInput, fromToken)
	const percentValidator = usePercentInputValidator(debouncedAmountInput, fromToken)
	const dollarValidator = useDollarInputValidator(debouncedAmountInput, fromToken)

	const determineMode = useCallback((input: string, connected: boolean): Mode => {
		if (!input) return Mode.None

		if (!connected) {
			if (input.includes('$')) return Mode.Dollar
			return Mode.Number
		}

		if (input.includes('$')) return Mode.Dollar
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
			setError(null)
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
		setFromAmount,
	])

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value

			if (!value.trim()) {
				setAmountInputError(null)
			}

			const processedValue = !isConnected ? value.replace(/%/g, '') : value

			if (!isConnected) {
				if (processedValue.includes('$')) {
					const sanitizedValue = sanitizeNumbers(processedValue.replace('$', ''))
					setAmountInput(sanitizedValue + '$')
				} else {
					const sanitizedValue = sanitizeNumbers(processedValue)
					setAmountInput(sanitizedValue)
				}
				return
			}

			const sanitizedValue = /^[a-zA-Z]+$/.test(processedValue)
				? sanitizeText(processedValue)
				: sanitizeNumbers(processedValue)

			setAmountInput(sanitizedValue)
		},
		[setAmountInput, setAmountInputError, isConnected],
	)

	const onFocus = useCallback(
		(e: FocusEvent<HTMLInputElement>) => {
			setAmountInputFocused(true)
			if (e.target.placeholder === '0') {
				e.target.placeholder = ''
			}
		},
		[setAmountInputFocused],
	)

	const onBlur = useCallback(
		(e: FocusEvent<HTMLInputElement>) => {
			setAmountInputFocused(false)
			if (!e.target.value) {
				e.target.placeholder = '0'
				clearInputs()
			}
		},
		[clearInputs, setAmountInputFocused],
	)

	return {
		onChange,
		onFocus,
		onBlur,
	}
}
