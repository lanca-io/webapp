import type { ExtendedToken } from '../store/tokens/types'
import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { preciseMultiply } from '../utils/new/operations'
import { useAccount } from 'wagmi'
import Decimal from 'decimal.js'

export const useNumberInputValidator = (input: string, token: ExtendedToken | null) => {
	const { setAmountInputError, setFromAmount } = useFormStore()
	const { isConnected } = useAccount()
	const balanceStr = token?.balance ?? '0'
	const symbol = token?.symbol ?? ''
	const decimals = token?.decimals ?? 18
	const priceUsd = token?.price_usd ?? 0

	const validation = useMemo(() => {
		if (!input.trim()) {
			return { valid: false, error: null, machineAmt: null }
		}

		if (input.startsWith('-')) {
			return {
				valid: false,
				error: 'Negative values are not allowed',
				machineAmt: null,
			}
		}

		if (!/^[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?$/.test(input)) {
			return {
				valid: false,
				error: 'Invalid number format',
				machineAmt: null,
			}
		}

		try {
			const amtDec = new Decimal(input)
			const factor = new Decimal(10).pow(decimals)
			const machineAmtDec = preciseMultiply(amtDec, factor)

			if (machineAmtDec.eq(0) && amtDec.gt(0)) {
				return {
					valid: false,
					error: 'Amount too small',
					machineAmt: null,
				}
			}

			if (!isConnected) {
				return {
					valid: true,
					error: null,
					machineAmt: machineAmtDec.toFixed(0),
				}
			}

			const usdVal = preciseMultiply(amtDec, new Decimal(priceUsd))
			if (usdVal.lt(0.25)) {
				return {
					valid: false,
					error: 'Amount too low',
					machineAmt: null,
				}
			}

			const balDec = new Decimal(balanceStr)
			if (machineAmtDec.gt(balDec)) {
				return {
					valid: false,
					error: `Not enough ${symbol}`,
					machineAmt: null,
				}
			}

			return {
				valid: true,
				error: null,
				machineAmt: machineAmtDec.toFixed(0),
			}
		} catch (e) {
			console.error('Error parsing number:', e)
			return {
				valid: false,
				error: 'Invalid number input',
				machineAmt: null,
			}
		}
	}, [input, balanceStr, decimals, symbol, priceUsd, isConnected])

	return useCallback(() => {
		setAmountInputError(validation.error)
		setFromAmount(validation.valid ? validation.machineAmt : null)
	}, [validation, setAmountInputError, setFromAmount])
}
