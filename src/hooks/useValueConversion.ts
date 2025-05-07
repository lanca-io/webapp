import { useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { Mode } from '../store/form/types'
import { formatTokenAmount } from '../utils/new/tokens'
import { tokenAmountToUsd, percentOfBalanceToUsd, textCommandToUsd, usdToTokenAmount } from '../utils/new/input'

type ConversionResult = {
	usd: string | null
	token: string | null
	isValid: boolean
	rawUsd: string | null
	isUsdMode: boolean
}

export const useValueConversion = (): ConversionResult => {
	const { inputValue, inputMode, sourceToken } = useFormStore()

	const { balance, price, sym } = useMemo(
		() => ({
			balance: formatTokenAmount(sourceToken?.balance ?? '0', sourceToken?.decimals ?? 18),
			price: sourceToken?.priceUsd ?? 0,
			sym: sourceToken?.symbol ?? '',
			decimals: sourceToken?.decimals ?? 18,
		}),
		[sourceToken],
	)

	const { usd, token } = useMemo(() => {
		if (!inputValue.trim() || inputMode === Mode.None) return { usd: null, token: null }

		if (inputMode === Mode.Dollar) {
			const value = inputValue.replace(/^\$/, '')
			const num = parseFloat(value)

			return isNaN(num)
				? { usd: null, token: null }
				: { usd: `${num}$`, token: usdToTokenAmount(num, price, sym) }
		}

		let usd: string | null = null

		switch (inputMode) {
			case Mode.Number:
				const amount = parseFloat(inputValue)
				usd = isNaN(amount) ? null : tokenAmountToUsd(amount, price)
				break
			case Mode.Percent:
				usd = percentOfBalanceToUsd(inputValue, balance, price)
				break
			case Mode.Text:
				usd = textCommandToUsd(inputValue, balance, price)
				break
		}

		return { usd, token: null }
	}, [inputValue, inputMode, balance, price, sym])

	return {
		usd,
		token,
		isValid: usd !== null && price > 0,
		rawUsd: usd?.replace('$', '') || null,
		isUsdMode: inputMode === Mode.Dollar,
	}
}
