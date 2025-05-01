import type { ExtendedToken } from '../store/tokens/types'
import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'

export const useDollarInputValidator = (value: string, token: ExtendedToken | null) => {
	const { setError } = useFormStore()
	const priceUsd = token?.priceUsd ?? 0
	const symbol = token?.symbol ?? ''
	const balance = token?.balance ?? '0'

	const validation = useMemo(() => {
		if (!value.trim()) {
			return { valid: false, errorMessage: null }
		}

		if (!/^\$?\d*\.?\d*$/.test(value)) {
			return {
				valid: false,
				errorMessage: 'Please enter a valid dollar amount',
			}
		}

		if (priceUsd <= 0) {
			return {
				valid: false,
				errorMessage: `Price data unavailable for ${symbol}`,
			}
		}

		if (parseFloat(balance) === 0) {
			return {
				valid: false,
				errorMessage: `You don't have any ${symbol}`,
			}
		}

		const amountValue = value.replace('$', '')
		const usdAmount = parseFloat(amountValue)

		if (usdAmount <= 0) {
			return {
				valid: false,
				errorMessage: 'Amount must be greater than 0',
			}
		}

		return { valid: true, errorMessage: null }
	}, [value, priceUsd, symbol, balance])

	return useCallback(() => {
		setError(validation.errorMessage)
	}, [validation.errorMessage, setError])
}
