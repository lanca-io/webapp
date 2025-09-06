import { useCallback, useMemo } from 'react'
import { textToAmount } from '../utils/new/input'
import { useFormStore } from '../store/form/useFormStore'
import { ExtendedToken } from '../store/tokens/types'
import { preciseDivide, preciseMultiply } from '../utils/new/operations'
import { Decimal } from 'decimal.js'

export const useTextInputValidator = (input: string, token: ExtendedToken | null) => {
	const { setAmountInputError, setFromAmount } = useFormStore()
	const balanceStr = token?.balance ?? '0'
	const symbol = token?.symbol ?? ''
	const decimals = token?.decimals ?? 18
	const price = token?.price_usd ?? 0

	const validation = useMemo(() => {
		if (!input.trim()) {
			return { valid: false, error: null, machineAmt: null }
		}

		try {
			const balanceInt = BigInt(balanceStr)
			const factorDec = new Decimal(10).pow(decimals)
			const balanceDec = preciseDivide(balanceStr, factorDec.toString())

			const humanAmt = textToAmount(input, balanceDec)
			if (!humanAmt) {
				return { valid: false, error: 'Invalid amount format', machineAmt: null }
			}

			const humanDec = new Decimal(humanAmt.toString())
			const machineDec = preciseMultiply(humanDec, factorDec)
			const machineStr = machineDec.toFixed(0)
			const machineInt = BigInt(machineStr)

			if (machineInt > balanceInt) {
				return { valid: false, error: `Not enough ${symbol}`, machineAmt: null }
			}

			if (machineInt === 0n && humanDec.gt(0)) {
				return { valid: false, error: 'Amount too small', machineAmt: null }
			}

			const usdValue = preciseMultiply(humanDec, new Decimal(price))
			if (usdValue.lt(0.15)) {
				return { valid: false, error: 'Amount too low', machineAmt: null }
			}

			return { valid: true, error: null, machineAmt: machineStr }
		} catch {
			return { valid: false, error: 'Invalid text input', machineAmt: null }
		}
	}, [input, balanceStr, decimals, symbol, price])

	return useCallback(() => {
		setAmountInputError(validation.error)
		setFromAmount(validation.valid ? validation.machineAmt : null)
	}, [validation, setAmountInputError, setFromAmount])
}
