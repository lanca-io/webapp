import { useCallback, useMemo } from 'react'
import { textToAmount } from '../utils/new/input'
import { useFormStore } from '../store/form/useFormStore'
import { ExtendedToken } from '../store/tokens/types'
import { parseTokenAmount } from '../utils/new/tokens'

export const useTextInputValidator = (text: string, token: ExtendedToken | null) => {
	const { setError, setAmount } = useFormStore()
	const balance = token?.balance ?? '0'
	const symbol = token?.symbol ?? ''
	const decimals = token?.decimals ?? 18

	const validation = useMemo(() => {
		if (!text.trim()) {
			return { valid: false, errorMessage: null, machineAmount: null }
		}

		const bal = parseFloat(balance) / Math.pow(10, decimals)
		const humanAmount = textToAmount(text, bal)

		if (!humanAmount) {
			return {
				valid: false,
				errorMessage: 'Unsupported command',
				machineAmount: null,
			}
		}

		const machineAmount = parseTokenAmount(humanAmount.toString(), decimals)

		return {
			valid: true,
			errorMessage: null,
			machineAmount,
		}
	}, [text, balance, decimals, symbol])

	return useCallback(() => {
		setError(validation.errorMessage)

		if (validation.valid && validation.machineAmount) {
			setAmount(validation.machineAmount)
		} else {
			setAmount(null)
		}
	}, [validation, setError, setAmount])
}
