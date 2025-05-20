import type { ChangeEvent, FocusEvent } from 'react'
import { useCallback, useEffect } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { AddressMode } from '../store/form/types'
import { useAddressInputValidator } from './useAddressInputValidator'
import { useEnsInputValidator } from './useENSInputValidator'
import { isAddress } from 'viem'

const SANITIZE_REGEX = /[^a-zA-Z0-9.-]/g

export const useAddressInputHandlers = () => {
	const {
		addressInput,
		addressInputMode,
		setAddressInput,
		setAddressInputMode,
		setAddressInputFocused,
		clearInputs,
	} = useFormStore()

	const addressValidator = useAddressInputValidator(addressInput)
	const ensValidator = useEnsInputValidator(addressInput)

	const determineAddressMode = useCallback((input: string): AddressMode => {
		if (!input) return AddressMode.None
		if (/^([a-zA-Z0-9-]+\.)+[a-z]{2,}$/.test(input)) return AddressMode.ENS
		return isAddress(input) ? AddressMode.Address : AddressMode.None
	}, [])

	const validateInput = useCallback(() => {
		if (addressInputMode === AddressMode.None) return

		const validator = {
			[AddressMode.ENS]: ensValidator,
			[AddressMode.Address]: addressValidator,
		}[addressInputMode]

		validator()
	}, [addressInputMode, ensValidator, addressValidator])

	useEffect(() => {
		const mode = determineAddressMode(addressInput)
		if (mode !== addressInputMode) {
			setAddressInputMode(mode)
		}
		validateInput()
	}, [addressInput, addressInputMode, determineAddressMode, setAddressInputMode, validateInput])

	const onChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value
			const sanitizedValue = value.replace(SANITIZE_REGEX, '').toLowerCase()
			setAddressInput(sanitizedValue)
		},
		[setAddressInput],
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
				e.target.placeholder = 'Wallet or ENS'
				clearInputs()
			}
		},
		[setAddressInputFocused, clearInputs],
	)

	return {
		onChange,
		onFocus,
		onBlur,
	}
}
