import type { ExtendedToken } from '../store/tokens/types'
import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'

export const useNumberInputValidator = (value: string, token: ExtendedToken | null) => {
	const { setError } = useFormStore()
	const balance = token?.balance ?? '0'
	const symbol = token?.symbol ?? ''

	const validation = useMemo(() => {
		if (!value.trim()) {
			return { valid: false, errorMessage: null }
		}

		if (!/^\d*\.?\d*$/.test(value)) {
			return {
				valid: false,
				errorMessage: 'Please enter a valid number',
			}
		}

		if (parseFloat(balance) === 0) {
			return {
				valid: false,
				errorMessage: `You don't have any ${symbol}`,
			}
		}

		const amount = parseFloat(value)
		if (amount <= 0) {
			return {
				valid: false,
				errorMessage: 'Amount must be greater than 0',
			}
		}

		return { valid: true, errorMessage: null }
	}, [value, balance, symbol])

	return useCallback(() => {
		setError(validation.errorMessage)
	}, [validation.errorMessage, setError])
}
