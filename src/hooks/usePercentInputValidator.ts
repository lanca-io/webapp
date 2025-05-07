import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { ExtendedToken } from '../store/tokens/types'
import { toPreciseNumber, preciseMultiply } from '../utils/new/operations'

export const usePercentInputValidator = (value: string, token: ExtendedToken | null) => {
	const { setError, setAmount } = useFormStore()
	const balance = token?.balance ?? '0'

	const validation = useMemo(() => {
		if (!value.trim()) {
			return { valid: false, errorMessage: null, machineAmount: null }
		}

		try {
			const cleanValue = value.replace(/[^\d.]/g, '')
			const percentage = toPreciseNumber(cleanValue)

			if (percentage > 100) {
				return {
					valid: false,
					errorMessage: 'Percentage cannot exceed 100%',
					machineAmount: null,
				}
			}

			const basisPoints = Math.round(preciseMultiply(percentage, 100))
			const balanceBigInt = BigInt(balance)
			const amountBigInt = (balanceBigInt * BigInt(basisPoints)) / BigInt(10000)
			const machineAmount = amountBigInt.toString()

			if (amountBigInt === 0n && percentage > 0) {
				return {
					valid: false,
					errorMessage: 'Amount too small',
					machineAmount: null,
				}
			}

			return {
				valid: true,
				errorMessage: null,
				machineAmount,
			}
		} catch (error) {
			return {
				valid: false,
				errorMessage: 'Invalid percentage input',
				machineAmount: null,
			}
		}
	}, [value, balance])

	return useCallback(() => {
		setError(validation.errorMessage)
		setAmount(validation.valid ? validation.machineAmount : null)
	}, [validation, setError, setAmount])
}
