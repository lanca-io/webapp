import type { ExtendedToken } from '../store/tokens/types'
import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { preciseMultiply, preciseDivide } from '../utils/new/operations'
import { useAccount } from 'wagmi'
import { Decimal } from 'decimal.js'

export const useDollarInputValidator = (input: string, token: ExtendedToken | null) => {
	const { setAmountInputError, setFromAmount } = useFormStore()
	const { isConnected } = useAccount()
	const price = token?.price_usd ?? 0
	const symbol = token?.symbol ?? ''
	const balanceStr = token?.balance ?? '0'
	const decimals = token?.decimals ?? 18

	const validation = useMemo(() => {
		if (!input.trim()) {
			return { valid: false, error: null, machineAmt: null }
		}

		if (!/^\$?\d*\.?\d*\$?$/.test(input)) {
			return { valid: false, error: 'Please enter a valid dollar amount', machineAmt: null }
		}

		try {
			const cleanInput = input.replace(/[^\d.]/g, '')
			const usdDec = new Decimal(cleanInput)

			if (cleanInput.startsWith('-')) {
				return { valid: false, error: 'Dollar amount cannot be negative', machineAmt: null }
			}

			if (usdDec.lte(0)) {
				return { valid: false, error: 'Amount must be greater than $0', machineAmt: null }
			}

			const tokenAmount = preciseDivide(usdDec, new Decimal(price))
			const factorDec = new Decimal(10).pow(decimals)
			const machineDec = preciseMultiply(tokenAmount, factorDec)
			const machineStr = machineDec.toFixed(0)

			if (!isConnected) {
				return { valid: true, error: null, machineAmt: machineStr }
			}

			const balanceInt = BigInt(balanceStr)
			const machineInt = BigInt(machineStr)

			if (machineInt > balanceInt) {
				return { valid: false, error: `Not enough ${symbol}`, machineAmt: null }
			}

			if (machineInt === 0n && usdDec.gt(0)) {
				return { valid: false, error: 'Amount too small to convert', machineAmt: null }
			}

			if (usdDec.lt(0.25)) {
				return { valid: false, error: 'Amount too low', machineAmt: null }
			}

			return { valid: true, error: null, machineAmt: machineStr }
		} catch {
			return { valid: false, error: 'Invalid dollar input', machineAmt: null }
		}
	}, [input, price, symbol, balanceStr, decimals, isConnected])

	return useCallback(() => {
		setAmountInputError(validation.error)
		setFromAmount(validation.valid ? validation.machineAmt : null)
	}, [validation, setAmountInputError, setFromAmount])
}
