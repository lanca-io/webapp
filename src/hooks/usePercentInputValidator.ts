import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { ExtendedToken } from '../store/tokens/types'
import { preciseMultiply } from '../utils/new/operations'

export const usePercentInputValidator = (value: string, token: ExtendedToken | null) => {
	const { setAmountInputError, setFromAmount } = useFormStore()
	const balance = token?.balance ?? '0'
	const priceUsd = token?.priceUsd ?? 0

	const validation = useMemo(() => {
		if (!value.trim()) {
			return { valid: false, errorMessage: null, machineAmount: null }
		}

		try {
			const cleanValue = value.replace(/[^\d.]/g, '')
			const percentage = Number(cleanValue)

			if (isNaN(percentage)) {
				return {
					valid: false,
					errorMessage: 'Input is not a valid number',
					machineAmount: null,
				}
			}

			if (percentage < 0) {
				return {
					valid: false,
					errorMessage: 'Percentage cannot be negative',
					machineAmount: null,
				}
			}

			if (percentage > 100) {
				return {
					valid: false,
					errorMessage: 'Percentage cannot exceed 100%',
					machineAmount: null,
				}
			}

			const basisPoints = preciseMultiply(cleanValue, 100)
			const basisPointsBigInt = BigInt(basisPoints)

			const balanceBigInt = BigInt(balance)
			const amountBigInt = (balanceBigInt * basisPointsBigInt) / 10000n
			const machineAmount = amountBigInt.toString()

			if (amountBigInt === 0n && percentage > 0) {
				return {
					valid: false,
					errorMessage: 'Amount too small',
					machineAmount: null,
				}
			}

			const usdValue = preciseMultiply(Number(value), priceUsd)

			if (usdValue < 0.15) {
				return {
					valid: false,
					errorMessage: 'Amount too low',
					machineAmount: null,
				}
			}

			return {
				valid: true,
				errorMessage: null,
				machineAmount,
			}
		} catch (_) {
			return {
				valid: false,
				errorMessage: 'Invalid percentage input',
				machineAmount: null,
			}
		}
	}, [value, balance])

	return useCallback(() => {
		setAmountInputError(validation.errorMessage)
		setFromAmount(validation.valid ? validation.machineAmount : null)
	}, [validation, setAmountInputError, setFromAmount])
}
