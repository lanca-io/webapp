import type { PercentageModeResult } from './types'
import { useCallback, useMemo } from 'react'
import { useFormStore } from '../../../store/form/useFormStore'

export const usePercentMode = (value: string, balance: string): PercentageModeResult => {
	const { setAmount, clearAmount } = useFormStore()

	const processedPercentage = useMemo(() => {
		const cleanValue = value.replace('%', '')
		const percentage = parseFloat(cleanValue)
		return {
			isValid: !isNaN(percentage) && percentage >= 0 && percentage <= 100,
			value: percentage,
		}
	}, [value])

	return useCallback(() => {
		if (!processedPercentage.isValid) {
			clearAmount()
			return
		}

		const amount = Math.round((processedPercentage.value / 100) * Number(balance))
		setAmount(amount.toString())
	}, [processedPercentage, balance, setAmount, clearAmount])
}
