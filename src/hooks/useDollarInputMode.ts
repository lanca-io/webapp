import type { ExtendedToken } from '../store/tokens/types'
import { useCallback, useMemo } from 'react'
import { parseTokenAmount } from '../utils/new/tokens'
import { useFormStore } from '../store/form/useFormStore'

export const useDollarInputMode = (value: string, token: ExtendedToken | null) => {
	const { setAmount, clearAmount } = useFormStore()
	const priceUsd = token?.priceUsd ?? 0
	const decimals = token?.decimals ?? 18

	const result = useMemo(() => {
		if (!value.trim() || !/^\d*\.?\d*\$?$/.test(value) || priceUsd <= 0) {
			return { valid: false, amount: null }
		}

		const amountValue = value.replace('$', '')
		const usdAmount = parseFloat(amountValue)

		if (isNaN(usdAmount)) {
			return { valid: false, amount: null }
		}

		const tokenQuantity = usdAmount / priceUsd
		const amount = parseTokenAmount(tokenQuantity.toString(), decimals)

		return {
			valid: amount !== null,
			amount,
		}
	}, [value, priceUsd, decimals])

	return useCallback(() => {
		if (!result.valid || !result.amount) {
			clearAmount()
			return
		}

		setAmount(result.amount)
	}, [result, clearAmount, setAmount])
}
