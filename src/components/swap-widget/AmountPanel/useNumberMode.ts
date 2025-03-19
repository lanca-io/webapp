import type { NumericalModeResult } from './types'
import { useCallback, useMemo } from 'react'
import { parseTokenAmount } from '../../../utils/new/tokens'
import { useFormStore } from '../../../store/form/useFormStore'

export const useNumberMode = (value: string, decimals: number): NumericalModeResult => {
	const { setAmount, clearAmount } = useFormStore()

	const isValidNumber = useMemo(() => /^\d*\.?\d*$/.test(value), [value])

	return useCallback(() => {
		if (!value.trim() || !isValidNumber) {
			clearAmount()
			return
		}

		const amount = parseTokenAmount(value, decimals)
		amount !== null ? setAmount(amount) : clearAmount()
	}, [value, decimals, setAmount, clearAmount, isValidNumber])
}
