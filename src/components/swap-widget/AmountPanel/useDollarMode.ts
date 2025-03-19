import type { NumericalModeResult } from './types'
import { useCallback, useMemo } from 'react'
import { parseTokenAmount } from '../../../utils/new/tokens'
import { useFormStore } from '../../../store/form/useFormStore'

export const useDollarMode = (value: string, priceUsd: number, decimals: number): NumericalModeResult => {
	const { setAmount, clearAmount } = useFormStore()

	const isValidNumber = useMemo(() => {
		const isValid = /^\d*\.?\d*\$?$/.test(value)
		return isValid
	}, [value])

	return useCallback(() => {
		if (!value.trim() || !isValidNumber || priceUsd <= 0) {
			clearAmount()
			return
		}

		const amountValue = value.replace('$', '')

		const usdAmount = parseFloat(amountValue)

		if (isNaN(usdAmount)) {
			clearAmount()
			return
		}

		const tokenQuantity = usdAmount / priceUsd

		const amount = parseTokenAmount(tokenQuantity.toString(), decimals)

		amount !== null ? setAmount(amount) : clearAmount()
	}, [value, priceUsd, decimals, setAmount, clearAmount, isValidNumber])
}
