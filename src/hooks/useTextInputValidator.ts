import { useCallback, useMemo } from 'react'
import { textToAmount } from '../utils/new/input'
import { useFormStore } from '../store/form/useFormStore'
import { ExtendedToken } from '../store/tokens/types'
import { preciseDivide, preciseMultiply } from '../utils/new/operations'

export const useTextInputValidator = (text: string, token: ExtendedToken | null) => {
	const { setError, setAmount } = useFormStore()
	const balance = token?.balance ?? '0'
	const symbol = token?.symbol ?? ''
	const decimals = token?.decimals ?? 18

	const validation = useMemo(() => {
		if (!text.trim()) {
			return { valid: false, errorMessage: null, machineAmount: null }
		}

		try {
			const decimalsFactor = Math.pow(10, decimals)
			const bal = preciseDivide(balance, decimalsFactor.toString())
			const humanAmount = textToAmount(text, Number(bal))

			if (!humanAmount) {
				return {
					valid: false,
					errorMessage: 'Unsupported command',
					machineAmount: null,
				}
			}

			const machineAmount = preciseMultiply(humanAmount.toString(), decimalsFactor.toString())
			const machineAmountStr = machineAmount.toFixed(0)

			if (BigInt(machineAmountStr) > BigInt(balance)) {
				return {
					valid: false,
					errorMessage: `Not enough ${symbol}`,
					machineAmount: null,
				}
			}

			return {
				valid: true,
				errorMessage: null,
				machineAmount: machineAmountStr,
			}
		} catch (error) {
			return {
				valid: false,
				errorMessage: 'Invalid input',
				machineAmount: null,
			}
		}
	}, [text, balance, decimals])

	return useCallback(() => {
		setError(validation.errorMessage)
		setAmount(validation.valid ? validation.machineAmount : null)
	}, [validation, setError, setAmount])
}
