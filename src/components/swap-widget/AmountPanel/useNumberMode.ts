import type { NumericalModeResult } from './types'
import { useCallback, useMemo } from 'react'
import { parseTokenAmount } from '../../../utils/new/tokens'
import { useFormStore } from '../../../store/form/useFormStore'

export const useNumberMode = (value: string, decimals: number, balance: string): NumericalModeResult => {
	const { setAmount, clearAmount, setError } = useFormStore()

	const isValidNumber = useMemo(() => /^\d*\.?\d*$/.test(value), [value])

	return useCallback(() => {
		if (!value.trim() || !isValidNumber) {
			clearAmount()
			setError('Invalid number format')
			return
		}

		if (parseFloat(balance) === 0) {
			clearAmount()
			setError('Insufficient balance')
			return
		}

		const amount = parseTokenAmount(value, decimals)
		if (amount === null) {
			clearAmount()
			setError('Invalid token amount')
			return
		}

		setAmount(amount)
		setError(null)
	}, [value, decimals, balance, setAmount, clearAmount, isValidNumber, setError])
}
