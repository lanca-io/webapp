import type { ChangeEvent, FocusEvent } from 'react'
import { useCallback, useEffect } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { AddressMode } from '../store/form/types'
import { useAddressInputValidator } from './useAddressInputValidator'

const SANITIZE_REGEX = /[^a-zA-Z0-9.@:-]/g

export const useAddressInputHandlers = () => {
	const {
		addressInput,
		addressInputMode,
		setAddressInput,
		setAddressInputError,
		setAddressInputMode,
		setToAddress,
		setAddressInputFocused,
	} = useFormStore()

	const addressValidator = useAddressInputValidator(addressInput)
	const determineAddressMode = useCallback((input: string): AddressMode => {
		if (!input) return AddressMode.None
		return AddressMode.Address
	}, [])

	const validateInput = useCallback(() => {
		if (addressInputMode === AddressMode.None) return
		if (addressInputMode === AddressMode.Address) {
			addressValidator()
		}
	}, [addressInputMode, addressValidator])

	useEffect(() => {
		const newMode = determineAddressMode(addressInput)
		if (newMode !== addressInputMode) {
			setAddressInputMode(newMode)
		}
		if (addressInput && newMode === addressInputMode) {
			validateInput()
		}
	}, [addressInput, addressInputMode, determineAddressMode, setAddressInputMode, validateInput])

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value
			const sanitizedValue = value.replace(SANITIZE_REGEX, '').toLowerCase()
			setAddressInput(sanitizedValue)
			if (!sanitizedValue) {
				setAddressInputError(null)
				setToAddress(null)
			}
		},
		[setAddressInput, setAddressInputError, setToAddress],
	)

	const onFocus = useCallback(
		(e: FocusEvent<HTMLInputElement>) => {
			setAddressInputFocused(true)
			e.target.placeholder = ''
		},
		[setAddressInputFocused],
	)

	const onBlur = useCallback(
		(e: FocusEvent<HTMLInputElement>) => {
			setAddressInputFocused(false)
			if (!e.target.value) {
				e.target.placeholder = 'Wallet'
				setAddressInputError(null)
				setToAddress(null)
			}
		},
		[setAddressInputFocused, setAddressInputError, setToAddress],
	)

	return {
		onChange,
		onFocus,
		onBlur,
	}
}
