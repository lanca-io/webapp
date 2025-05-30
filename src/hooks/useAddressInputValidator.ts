import type { Address } from 'viem'
import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { isAddress } from 'viem'

export const useAddressInputValidator = (value: string) => {
	const { setAddressInputError, setToAddress } = useFormStore()

	const validation = useMemo(() => {
		if (!value.trim()) {
			return { valid: false, errorMessage: null, resolvedAddress: null }
		}

		if (isAddress(value)) {
			return {
				valid: true,
				errorMessage: null,
				resolvedAddress: value as Address,
			}
		}

		return {
			valid: false,
			errorMessage: 'Invalid Ethereum address',
			resolvedAddress: null,
		}
	}, [value])

	return useCallback(() => {
		setAddressInputError(validation.errorMessage)
		setToAddress(validation.valid ? validation.resolvedAddress : null)
	}, [validation, setAddressInputError, setToAddress])
}
