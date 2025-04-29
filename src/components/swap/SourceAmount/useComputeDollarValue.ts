import type { ExtendedToken } from '../../../store/tokens/types'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { Mode } from './types'
import { formatTokenAmount } from '../../../utils/new/tokens'
import { calculateAmountFromText } from '../../../utils/new/input'

export const useComputeDollarValue = (value: string, mode: Mode, tokenData: ExtendedToken | null) => {
	const [dollarValue, setDollarValue] = useState<string | null>(null)

	const tokenInfo = useMemo(
		() => ({
			balance: parseFloat(tokenData?.balance ?? '0'),
			priceUsd: tokenData?.priceUsd ?? 0,
			decimals: tokenData?.decimals ?? 18,
		}),
		[tokenData],
	)

	const computeDollarAmount = useCallback(
		(amount: number): string => {
			return `$${amount}`
		},
		[tokenInfo.priceUsd],
	)

	const computePercentageAmount = useCallback(
		(percentStr: string): string | null => {
			const percentage = parseFloat(percentStr.replace('%', ''))
			const amount = (percentage / 100) * tokenInfo.balance
			return computeDollarAmount(amount)
		},
		[tokenInfo.balance, computeDollarAmount],
	)

	const computeTextAmount = useCallback(
		(text: string): string | null => {
			const amountStr = calculateAmountFromText(text, tokenInfo.balance)
			if (amountStr !== null) {
				const amount = parseFloat(amountStr)
				return !isNaN(amount) ? computeDollarAmount(amount) : null
			}
			return null
		},
		[tokenInfo.balance, computeDollarAmount],
	)

	useEffect(() => {
		if (!value.trim() || mode === Mode.None) {
			setDollarValue(null)
			return
		}

		let parsedValue = value

		if (mode !== Mode.Dollar) {
			parsedValue = formatTokenAmount(value, tokenInfo.decimals)
			console.log(parsedValue)
		}

		const computations = {
			[Mode.Dollar]: () => (parsedValue.startsWith('$') ? parsedValue : `$${parsedValue}`),
			[Mode.Number]: () => {
				const amount = parseFloat(parsedValue)
				return !isNaN(amount) ? computeDollarAmount(amount) : null
			},
			[Mode.Percent]: () => computePercentageAmount(parsedValue),
			[Mode.Text]: () => computeTextAmount(parsedValue),
		}

		const compute = computations[mode] || (() => null)
		const result = compute()
		setDollarValue(result)
	}, [value, mode, computeDollarAmount, computePercentageAmount, computeTextAmount, tokenInfo.decimals])

	return {
		dollarValue,
		isValid: dollarValue !== null && tokenInfo.priceUsd > 0,
	}
}
