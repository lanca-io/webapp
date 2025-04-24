import type { TextModeResult } from './types'
import { useCallback, useMemo } from 'react'
import { calculateAmountFromText } from '../../../utils/new/input'
import { useFormStore } from '../../../store/form/useFormStore'

export const useTextMode = (value: string, balance: string): TextModeResult => {
	const { setAmount, clearAmount } = useFormStore()

	const processedAmount = useMemo(() => {
		const amount = calculateAmountFromText(value, Number(balance))
		return {
			value: amount !== null ? Math.round(Number(amount)).toString() : null,
			isValid: Boolean(value && /^[a-z]+$/.test(value)),
		}
	}, [value, balance])

	return useCallback(() => {
		if (!processedAmount.isValid) {
			clearAmount()
			return
		}

		processedAmount.value !== null ? setAmount(processedAmount.value) : clearAmount()
	}, [processedAmount, setAmount, clearAmount])
}
