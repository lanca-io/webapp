import { tokenAmountToUsd, percentOfBalanceToUsd, textCommandToUsd } from '../utils/new/input'
import { useEffect, useState, useMemo, useCallback } from 'react'
import { formatTokenAmount } from '../utils/new/tokens'
import { Mode } from '../store/form/types'
import { useFormStore } from '../store/form/useFormStore'

export const useDollarEquivalent = () => {
	const [usdValue, setUsdValue] = useState<string | null>(null)
	const { inputValue, inputMode, sourceToken } = useFormStore()

	const tokenInfo = useMemo(
		() => ({
			balance: formatTokenAmount(sourceToken?.balance ?? '0', sourceToken?.decimals ?? 18),
			price: sourceToken?.priceUsd ?? 0,
			decimals: sourceToken?.decimals ?? 18,
		}),
		[sourceToken],
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
		const result = calculateUsd(inputValue, inputMode)
		setUsdValue(result)
	}, [inputValue, inputMode, calculateUsd])

	return {
		dollarValue: usdValue,
		isValid: usdValue !== null && tokenInfo.price > 0,
		rawDollarValue: usdValue?.replace('$', '') || null,
	}
}
