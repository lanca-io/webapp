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
	const { amountInput, amountInputMode, fromToken } = useFormStore()

	const { balance, price } = useMemo(
		() => ({
			balance: formatTokenAmount(fromToken?.balance ?? '0', fromToken?.decimals ?? 18),
			price: fromToken?.price_usd ?? 0,
			decimals: fromToken?.decimals ?? 18,
		}),
		[fromToken],
	)

	const { usd, token } = useMemo(() => {
		if (!amountInput.trim() || amountInputMode === Mode.None) return { usd: null, token: null }

		if (amountInputMode === Mode.Dollar) {
			const value = amountInput.replace(/^\$/, '')
			const num = parseFloat(value)

			return isNaN(num)
				? { usd: null, token: null }
				: { usd: `${num}$`, token: usdToTokenAmount(num, Number(price)) }
		}

		let usd: string | null = null

		switch (amountInputMode) {
			case Mode.Number:
				const amount = parseFloat(amountInput)
				usd = isNaN(amount) ? null : tokenAmountToUsd(amount, Number(price))
				break
			case Mode.Percent:
				usd = percentOfBalanceToUsd(amountInput, balance, Number(price))
				break
			case Mode.Text:
				usd = textCommandToUsd(amountInput, balance, Number(price))
				break
		}

		return { usd, token: null }
	}, [amountInput, amountInputMode, balance, price])

	return {
		usd,
		token,
		isValid: usd !== null && Number(price) > 0,
		rawUsd: usd?.replace('$', '') || null,
		isUsdMode: amountInputMode === Mode.Dollar,
	}
}
