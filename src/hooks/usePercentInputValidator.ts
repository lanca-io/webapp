import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { ExtendedToken } from '../store/tokens/types'
import { preciseDivide, preciseMultiply } from '../utils/new/operations'
import { Decimal } from 'decimal.js'

export const usePercentInputValidator = (input: string, token: ExtendedToken | null) => {
	const { setAmountInputError, setFromAmount } = useFormStore()
	const balanceStr = token?.balance ?? '0'
	const price = token?.price_usd ?? 0
	const decimals = token?.decimals ?? 18

	const validation = useMemo(() => {
		if (!input.trim()) {
			return { valid: false, error: null, machineAmt: null }
		}

		try {
			const cleanInput = input.replace(/[^\d.]/g, '')
			const percent = new Decimal(cleanInput)

			if (percent.isNaN()) {
				return { valid: false, error: 'Input is not a valid number', machineAmt: null }
			}

			if (percent.lt(0)) {
				return { valid: false, error: 'Percentage cannot be negative', machineAmt: null }
			}

			if (percent.gt(100)) {
				return { valid: false, error: 'Percentage cannot exceed 100%', machineAmt: null }
			}

			const bps = preciseMultiply(percent, 100)
			const balInt = BigInt(balanceStr)
			const bpsInt = BigInt(bps.toFixed(0))

			const amtInt = (balInt * bpsInt) / 10000n

			if (amtInt === 0n && percent.gt(0)) {
				return { valid: false, error: 'Amount too small', machineAmt: null }
			}

			const amtDec = preciseDivide(new Decimal(amtInt.toString()), new Decimal(10).pow(decimals))
			const usdVal = preciseMultiply(amtDec, new Decimal(price))

			if (usdVal.lt(0.25)) {
				return { valid: false, error: 'Amount too low', machineAmt: null }
			}

			return { valid: true, error: null, machineAmt: amtInt.toString() }
		} catch {
			return { valid: false, error: 'Invalid percentage input', machineAmt: null }
		}
	}, [input, balanceStr, decimals, price])

	return useCallback(() => {
		setAmountInputError(validation.error)
		setFromAmount(validation.valid ? validation.machineAmt : null)
	}, [validation, setAmountInputError, setFromAmount])
}
