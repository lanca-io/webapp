import type { ExtendedToken } from '../store/tokens/types'
import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { preciseMultiply, preciseDivide } from '../utils/new/operations'
import { useAccount } from 'wagmi'

export const useDollarInputValidator = (value: string, token: ExtendedToken | null) => {
	const { setAmountInputError, setFromAmount } = useFormStore()
	const { isConnected } = useAccount()
	const priceUsd = token?.price_usd ?? 0
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

			const tokenAmount = preciseDivide(usdAmount, priceUsd)
			const decimalsFactor = Math.pow(10, decimals)
			const machineAmount = preciseMultiply(tokenAmount, decimalsFactor).toFixed(0)

			if (!isConnected) {
				return {
					valid: true,
					errorMessage: null,
					machineAmount,
				}
			}

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

			if (Number(usdAmount) < 0.25) {
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
				errorMessage: 'Invalid dollar input',
				machineAmount: null,
			}
		}
	}, [value, priceUsd, symbol, balance, decimals, isConnected])

	return useCallback(() => {
		setAmountInputError(validation.errorMessage)
		setFromAmount(validation.valid ? validation.machineAmount : null)
	}, [validation, setAmountInputError, setFromAmount])
}
