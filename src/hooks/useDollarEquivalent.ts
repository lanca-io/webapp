import type { ExtendedToken } from '../store/tokens/types'
import { tokenAmountToUsd, percentOfBalanceToUsd, textCommandToUsd } from '../utils/new/input'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { formatTokenAmount } from '../utils/new/tokens'
import { Mode } from '../store/form/types'

export const useDollarEquivalent = (value: string, mode: Mode, token: ExtendedToken | null) => {
	const [usdValue, setUsdValue] = useState<string | null>(null)

	const tokenInfo = useMemo(
		() => ({
			balance: formatTokenAmount(token?.balance ?? '0', token?.decimals ?? 18),
			price: token?.priceUsd ?? 0,
			decimals: token?.decimals ?? 18,
		}),
		[token],
	)

	const calculateUsd = useCallback(
		(input: string, inputMode: Mode): string | null => {
			if (!input.trim() || inputMode === Mode.None) {
				return null
			}

			switch (inputMode) {
				case Mode.Dollar:
					return input.startsWith('$') ? input : `$${input}`

				case Mode.Number: {
					const amount = parseFloat(input)
					return !isNaN(amount) ? tokenAmountToUsd(amount, tokenInfo.price) : null
				}

				case Mode.Percent:
					return percentOfBalanceToUsd(input, tokenInfo.balance, tokenInfo.price)

				case Mode.Text:
					return textCommandToUsd(input, tokenInfo.balance, tokenInfo.price)

				default:
					return null
			}
		},
		[tokenInfo.balance, tokenInfo.price],
	)

	useEffect(() => {
		const result = calculateUsd(value, mode)
		setUsdValue(result)
	}, [value, mode, calculateUsd])

	return {
		dollarValue: usdValue,
		isValid: usdValue !== null && tokenInfo.price > 0,
		rawDollarValue: usdValue?.replace('$', '') || null,
	}
}
