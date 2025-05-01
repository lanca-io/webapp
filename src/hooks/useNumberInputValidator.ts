import type { ExtendedToken } from '../store/tokens/types'
import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { parseTokenAmount } from '../utils/new/tokens'

export const useNumberInputValidator = (value: string, token: ExtendedToken | null) => {
	const { setError, setAmount } = useFormStore()
	const balance = token?.balance ?? '0'
	const symbol = token?.symbol ?? ''
	const decimals = token?.decimals ?? 18

	const validation = useMemo(() => {
		if (!value.trim()) {
			return { valid: false, errorMessage: null, machineAmount: null }
		}

		if (!/^\d*\.?\d*$/.test(value)) {
			return {
				valid: false,
				errorMessage: 'Please enter a valid number',
				machineAmount: null,
			}
		}

		const machineAmount = parseTokenAmount(value, decimals)

		if (BigInt(machineAmount) > BigInt(balance)) {
			return {
				valid: false,
				errorMessage: 'Insufficient balance',
				machineAmount: null,
			}
		}

		return {
			valid: true,
			errorMessage: null,
			machineAmount,
		}
	}, [value, balance, symbol, decimals])

	return useCallback(() => {
		setError(validation.errorMessage)

		if (validation.valid && validation.machineAmount) {
			setAmount(validation.machineAmount)
		} else {
			setAmount(null)
		}
	}, [validation, setError, setAmount])
}
