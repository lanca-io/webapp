import type { ExtendedToken } from '../../../store/tokens/types'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { Mode } from './types'
import { format } from '../../../utils/new/format'
import { formatTokenAmount } from '../../../utils/new/tokens'

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
			return `$${format(amount * tokenInfo.priceUsd, 2)}`
		},
		[tokenInfo.priceUsd],
	)

	const computePercentageAmount = useCallback(
		(percentStr: string): string | null => {
			const percentage = parseFloat(percentStr.replace('%', ''))
			const amount = (percentage / 100) * Number(formatTokenAmount(String(tokenInfo.balance), tokenInfo.decimals))
			return computeDollarAmount(amount)
		},
		[tokenInfo.balance, computeDollarAmount],
	)

	useEffect(() => {
		if (!value.trim() || mode === Mode.None) {
			setDollarValue(null)
			return
		}

		const computations = {
			[Mode.Dollar]: () => (value.startsWith('$') ? value : `$${value}`),
			[Mode.Number]: () => {
				const amount = parseFloat(value)
				return !isNaN(amount) ? computeDollarAmount(amount) : null
			},
			[Mode.Percent]: () => computePercentageAmount(value),
			[Mode.Text]: () => null,
		}

		const compute = computations[mode] || (() => null)
		setDollarValue(compute())
	}, [value, mode, computeDollarAmount, computePercentageAmount])

	return {
		dollarValue,
		isValid: dollarValue !== null && tokenInfo.priceUsd > 0,
	}
}
