import type { ExtendedToken } from '../store/tokens/types'
import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { preciseMultiply, preciseDivide } from '../utils/new/operations'

export const useDollarInputValidator = (value: string, token: ExtendedToken | null) => {
	const { setAmountInputError, setFromAmount } = useFormStore()
	const price = token?.priceUsd ?? 0
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

		try {
			const cleanValue = value.replace(/[^\d.]/g, '')
			const usdAmount = cleanValue

			if (usdAmount.startsWith('-')) {
				return {
					valid: false,
					errorMessage: 'Dollar amount cannot be negative',
					machineAmount: null,
				}
			}

			if (!usdAmount || Number(usdAmount) <= 0) {
				return {
					valid: false,
					errorMessage: 'Amount must be greater than $0',
					machineAmount: null,
				}
			}

			const tokenAmount = preciseDivide(usdAmount, price)
			const decimalsFactor = Math.pow(10, decimals)
			const machineAmount = preciseMultiply(tokenAmount, decimalsFactor).toFixed(0)

			const balanceBigInt = BigInt(balance)
			if (BigInt(machineAmount) > balanceBigInt) {
				return {
					valid: false,
					errorMessage: `Not enough ${symbol}`,
					machineAmount: null,
				}
			}

			if (BigInt(machineAmount) === 0n && Number(usdAmount) > 0) {
				return {
					valid: false,
					errorMessage: 'Amount too small to convert',
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
				errorMessage: 'Invalid dollar input',
				machineAmount: null,
			}
		}
	}, [value, price, symbol, balance, decimals])

	return useCallback(() => {
		setAmountInputError(validation.errorMessage)
		setFromAmount(validation.valid ? validation.machineAmount : null)
	}, [validation, setAmountInputError, setFromAmount])
}
