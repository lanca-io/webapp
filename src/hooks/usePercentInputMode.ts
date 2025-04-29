import { useCallback, useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { ExtendedToken } from '../store/tokens/types'

export const usePercentInputMode = (value: string, token: ExtendedToken | null) => {
	const { setAmount, clearAmount } = useFormStore()
	const balance = token?.balance ?? '0'

	const result = useMemo(() => {
		const cleanValue = value.replace('%', '')
		const percentage = parseFloat(cleanValue)
		return {
			valid: !isNaN(percentage) && percentage >= 0 && percentage <= 100,
			value: percentage,
		}
	}, [value])

	return useCallback(() => {
		if (!result.valid) {
			clearAmount()
			return
		}

		const amount = Math.round((result.value / 100) * Number(balance))
		setAmount(amount.toString())
	}, [result, balance, setAmount, clearAmount])
}
