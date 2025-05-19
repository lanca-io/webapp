import { useCallback, useMemo } from 'react'
import { textToAmount } from '../utils/new/input'
import { useFormStore } from '../store/form/useFormStore'
import { ExtendedToken } from '../store/tokens/types'
import { preciseDivide, preciseMultiply } from '../utils/new/operations'

export const useTextInputValidator = (text: string, token: ExtendedToken | null) => {
	const { setAmountInputError, setFromAmount } = useFormStore()
	const balance = token?.balance ?? '0'
	const symbol = token?.symbol ?? ''
	const decimals = token?.decimals ?? 18

	const validation = useMemo(() => {
		if (!text.trim()) {
			return { valid: false, errorMessage: null, machineAmount: null }
		}

		try {
			const balanceBigInt = BigInt(balance)
			const decimalsFactor = 10 ** decimals
			const bal = preciseDivide(balance, decimalsFactor.toString())
			const humanAmount = textToAmount(text, Number(bal))

			if (!humanAmount) {
				return {
					valid: false,
					errorMessage: 'Invalid amount format',
					machineAmount: null,
				}
			}

			const machineAmount = preciseMultiply(humanAmount.toString(), decimalsFactor.toString())
			const machineAmountStr = machineAmount.toFixed(0)
			const machineAmountBigInt = BigInt(machineAmountStr)

			if (machineAmountBigInt > balanceBigInt) {
				return {
					valid: false,
					errorMessage: `Not enough ${symbol}`,
					machineAmount: null,
				}
			}

			if (machineAmountBigInt === 0n && Number(humanAmount) > 0) {
				return {
					valid: false,
					errorMessage: 'Amount too small',
					machineAmount: null,
				}
			}

			return {
				valid: true,
				errorMessage: null,
				machineAmount: machineAmountStr,
			}
		} catch (_) {
			return {
				valid: false,
				errorMessage: 'Invalid text input',
				machineAmount: null,
			}
		}
	}, [text, balance, decimals, symbol])

	return useCallback(() => {
		setAmountInputError(validation.errorMessage)
		setFromAmount(validation.valid ? validation.machineAmount : null)
	}, [validation, setAmountInputError, setFromAmount])
}
