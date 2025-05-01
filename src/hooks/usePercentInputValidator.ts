import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { ExtendedToken } from '../store/tokens/types'

export const usePercentInputValidator = (value: string, token: ExtendedToken | null) => {
	const { setError, setAmount } = useFormStore()
	const balance = token?.balance ?? '0'
	const symbol = token?.symbol ?? ''

	const validation = useMemo(() => {
		if (!value.trim()) {
			return { valid: false, errorMessage: null, machineAmount: null }
		}

		const cleanValue = value.replace('%', '')
		const percentage = parseFloat(cleanValue)

		if (percentage > 100) {
			return {
				valid: false,
				errorMessage: 'Percentage cannot exceed 100%',
				machineAmount: null,
			}
		}

		try {
			const balanceBigInt = BigInt(balance)
			const percentMultiplier = BigInt(Math.round(percentage * 100))
			const amountBigInt = (balanceBigInt * percentMultiplier) / BigInt(10000)
			const machineAmount = amountBigInt.toString()

			return {
				valid: true,
				errorMessage: null,
				machineAmount,
			}
		} catch (error) {
			return {
				valid: false,
				errorMessage: 'Error calculating amount',
				machineAmount: null,
			}
		}
	}, [value, balance, symbol])

	return useCallback(() => {
		setError(validation.errorMessage)

		if (validation.valid && validation.machineAmount) {
			setAmount(validation.machineAmount)
		} else {
			setAmount(null)
		}
	}, [validation, setError, setAmount])
}
