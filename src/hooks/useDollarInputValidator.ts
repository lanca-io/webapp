import type { ExtendedToken } from '../store/tokens/types'
import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { parseTokenAmount } from '../utils/new/tokens'

export const useDollarInputValidator = (value: string, token: ExtendedToken | null) => {
	const { setError, setAmount } = useFormStore()
	const priceUsd = token?.priceUsd ?? 0
	const symbol = token?.symbol ?? ''
	const balance = token?.balance ?? '0'
	const decimals = token?.decimals ?? 18

	const validation = useMemo(() => {
		if (!value.trim()) {
			return { valid: false, errorMessage: null, machineAmount: null }
		}

		if (!/^\$?\d*\.?\d*\$?$/.test(value)) {
			return {
				valid: false,
				errorMessage: 'Please enter a valid dollar amount',
				machineAmount: null,
			}
		}

		if (priceUsd <= 0) {
			return {
				valid: false,
				errorMessage: `Price data unavailable for ${symbol}`,
				machineAmount: null,
			}
		}

		if (parseFloat(balance) === 0) {
			return {
				valid: false,
				errorMessage: `Not enough ${symbol}`,
				machineAmount: null,
			}
		}

		const amountValue = value.replace('$', '')
		const usdAmount = parseFloat(amountValue)

		if (usdAmount <= 0) {
			return {
				valid: false,
				errorMessage: 'Amount must be greater than 0',
				machineAmount: null,
			}
		}

		const tokenAmount = usdAmount / priceUsd
		const machineAmount = parseTokenAmount(tokenAmount.toString(), decimals)

		return {
			valid: true,
			errorMessage: null,
			machineAmount,
		}
	}, [value, priceUsd, symbol, balance, decimals])

	return useCallback(() => {
		setError(validation.errorMessage)

		if (validation.valid && validation.machineAmount) {
			setAmount(validation.machineAmount)
		} else {
			setAmount(null)
		}
	}, [validation, setError, setAmount])
}
