import type { ExtendedToken } from '../store/tokens/types'
import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { preciseMultiply } from '../utils/new/operations'

export const useNumberInputValidator = (value: string, token: ExtendedToken | null) => {
	const { setAmountInputError, setFromAmount } = useFormStore()
	const balance = token?.balance ?? '0'
	const symbol = token?.symbol ?? ''
	const decimals = token?.decimals ?? 18
	const priceUsd = token?.priceUsd ?? 0

	const validation = useMemo(() => {
		if (!value.trim()) {
			return { valid: false, errorMessage: null, machineAmount: null }
		}

		if (value.startsWith('-')) {
			return {
				valid: false,
				errorMessage: 'Negative values are not allowed',
				machineAmount: null,
			}
		}

		if (!/^\d*\.?\d*$/.test(value)) {
			return {
				valid: false,
				errorMessage: 'Invalid number format',
				machineAmount: null,
			}
		}

		try {
			const amount = value
			const decimalsFactor = 10 ** decimals
			const machineAmount = preciseMultiply(amount, decimalsFactor).toString()

			if (machineAmount === '0' && Number(amount) > 0) {
				return {
					valid: false,
					errorMessage: 'Amount too small',
					machineAmount: null,
				}
			}

			const usdValue = preciseMultiply(Number(amount), priceUsd)

			if (usdValue < 0.15) {
				return {
					valid: false,
					errorMessage: 'Amount too low',
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
		} catch (_) {
			return {
				valid: false,
				errorMessage: 'Invalid number input',
				machineAmount: null,
			}
		}
	}, [value, balance, decimals, symbol])

	return useCallback(() => {
		setAmountInputError(validation.errorMessage)
		setFromAmount(validation.valid ? validation.machineAmount : null)
	}, [validation, setAmountInputError, setFromAmount])
}
