import type { ExtendedToken } from '../store/tokens/types'
import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { toPreciseNumber, preciseMultiply } from '../utils/new/operations'

export const useNumberInputValidator = (value: string, token: ExtendedToken | null) => {
	const { setAmountInputError, setFromAmount } = useFormStore()
	const balance = token?.balance ?? '0'
	const symbol = token?.symbol ?? ''
	const decimals = token?.decimals ?? 18

	const validation = useMemo(() => {
		if (!value.trim()) {
			return { valid: false, errorMessage: null, machineAmount: null }
		}

		if (!/^-?\d*\.?\d*$/.test(value)) {
			return {
				valid: false,
				errorMessage: 'Invalid number format',
				machineAmount: null,
			}
		}

		try {
			const amount = toPreciseNumber(value)
			const decimalPart = value.split('.')[1] || ''

			if (decimalPart.length > decimals) {
				return {
					valid: false,
					errorMessage: `Maximum ${decimals} decimal places`,
					machineAmount: null,
				}
			}

			const decimalsFactor = 10 ** decimals
			const machineAmount = preciseMultiply(amount, decimalsFactor).toFixed(0)

			if (machineAmount === '0' && amount > 0) {
				return {
					valid: false,
					errorMessage: 'Amount too small',
					machineAmount: null,
				}
			}

			if (BigInt(machineAmount) > BigInt(balance)) {
				return {
					valid: false,
					errorMessage: `Not enough ${symbol}`,
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
				errorMessage: 'Invalid number input',
				machineAmount: null,
			}
		}
	}, [value, balance, decimals])

	return useCallback(() => {
		setAmountInputError(validation.errorMessage)
		setFromAmount(validation.valid ? validation.machineAmount : null)
	}, [validation, setAmountInputError, setFromAmount])
}
