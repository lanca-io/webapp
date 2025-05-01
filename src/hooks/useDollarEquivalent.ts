import type { ExtendedToken } from '../store/tokens/types'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { Mode } from './useInputMode'
import { formatTokenAmount } from '../utils/new/tokens'
import { textToAmount } from '../utils/new/input'
import { format } from '../utils/new/format'

export const useDollarEquivalent = (value: string, mode: Mode, token: ExtendedToken | null) => {
	const [dollarValue, setDollarValue] = useState<string | null>(null)

	const tokenData = useMemo(
		() => ({
			rawBalance: token?.balance ?? '0',
			usdPrice: token?.priceUsd ?? 0,
			decimals: token?.decimals ?? 18,
			balance: formatTokenAmount(token?.balance ?? '0', token?.decimals ?? 18),
		}),
		[token],
	)

	const handleDollar = useCallback(
		(amount: number): string | null => {
			if (isNaN(amount) || amount < 0) {
				return null
			}

			const usdValue = amount * tokenData.usdPrice
			if (isNaN(usdValue) || !isFinite(usdValue)) {
				return null
			}

			return `$${format(usdValue)}`
		},
		[tokenData.usdPrice],
	)

	const handlePercentage = useCallback(
		(percentInput: string): string | null => {
			const percent = parseFloat(percentInput.replace('%', ''))

			if (isNaN(percent)) {
				return null
			}

			const amount = (percent / 100) * Number(tokenData.balance)
			return handleDollar(amount)
		},
		[tokenData.balance, handleDollar],
	)

	const handleText = useCallback(
		(text: string): string | null => {
			const result = textToAmount(text, Number(tokenData.balance))

			if (!result) {
				return null
			}

			const amount = parseFloat(result)
			return handleDollar(amount)
		},
		[tokenData.balance, handleDollar],
	)

	useEffect(() => {
		if (!value.trim() || mode === Mode.None) {
			setDollarValue(null)
			return
		}

		let result: string | null = null

		switch (mode) {
			case Mode.Dollar:
				result = value.startsWith('$') ? value : `$${value}`
				break

			case Mode.Number:
				const amount = parseFloat(value)
				if (!isNaN(amount)) {
					result = handleDollar(amount)
				}
				break

			case Mode.Percent:
				result = handlePercentage(value)
				break

			case Mode.Text:
				result = handleText(value)
				break

			default:
				result = null
				break
		}

		setDollarValue(result)
	}, [value, mode, handleDollar, handlePercentage, handleText])

	return {
		dollarValue,
		isValid: dollarValue !== null && tokenData.usdPrice > 0,
		rawDollarValue: dollarValue?.replace('$', '') || null,
	}
}
