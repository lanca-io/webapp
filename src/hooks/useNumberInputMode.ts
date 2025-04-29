import type { ExtendedToken } from '../store/tokens/types'
import { useCallback, useMemo } from 'react'
import { parseTokenAmount } from '../utils/new/tokens'
import { useFormStore } from '../store/form/useFormStore'

export const useNumberInputMode = (value: string, token: ExtendedToken | null) => {
	const { setAmount, clearAmount } = useFormStore()
	const balance = token?.balance ?? '0'
	const decimals = token?.decimals ?? 18

	const result = useMemo(() => {
		if (!value.trim() || !/^\d*\.?\d*$/.test(value) || parseFloat(balance) === 0) {
			return { valid: false, amount: null }
		}

		const parsedAmount = parseTokenAmount(value, decimals)
		return {
			valid: Boolean(parsedAmount),
			amount: parsedAmount,
		}
	}, [value, decimals, balance])

	return useCallback(() => {
		if (!result.valid || !result.amount) {
			clearAmount()
			return
		}

		setAmount(result.amount)
	}, [result, clearAmount, setAmount])
}
