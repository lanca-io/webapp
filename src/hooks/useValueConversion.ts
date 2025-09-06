import { useMemo } from 'react'
import { useFormStore } from '../store/form/useFormStore'
import { Mode } from '../store/form/types'
import { formatTokenAmount } from '../utils/new/tokens'
import { tokenAmountToUsd, percentOfBalanceToUsd, textCommandToUsd, usdToTokenAmount } from '../utils/new/input'
import { Decimal } from 'decimal.js'

type ConversionResult = {
	usd: string | null
	token: string | null
	isValid: boolean
	rawUsd: string | null
	isUsdMode: boolean
}

export const useValueConversion = (): ConversionResult => {
	const { amountInput, amountInputMode, fromToken } = useFormStore()

	const { balance, price } = useMemo(() => {
		const b = formatTokenAmount(fromToken?.balance ?? '0', fromToken?.decimals ?? 18)
		const p = new Decimal(fromToken?.price_usd ?? 0)
		return {
			balance: b,
			price: p,
			decimals: fromToken?.decimals ?? 18,
		}
	}, [fromToken])

	const { usd, token } = useMemo(() => {
		if (!amountInput.trim() || amountInputMode === Mode.None) {
			return { usd: null, token: null }
		}

		if (amountInputMode === Mode.Dollar) {
			const cleanValueStr = amountInput.replace(/\$/g, '').trim()
			let numDec: Decimal
			try {
				numDec = new Decimal(cleanValueStr)
			} catch (error) {
				return { usd: null, token: null }
			}

			if (numDec.isNaN()) {
				return { usd: null, token: null }
			}
			const usdStr = `${numDec.toString()}$`
			const tokenStr = usdToTokenAmount(numDec, price)
			return { usd: usdStr, token: tokenStr }
		}

		let usdVal: string | null = null

		switch (amountInputMode) {
			case Mode.Number: {
				const cleanInput = amountInput.replace(/\$/g, '').trim()
				let amountDec: Decimal
				try {
					amountDec = new Decimal(cleanInput)
				} catch (error) {
					usdVal = null
					break
				}
				if (amountDec.isNaN()) {
					usdVal = null
				} else {
					usdVal = tokenAmountToUsd(amountDec, price)
				}
				break
			}
			case Mode.Percent: {
				const balanceDec = new Decimal(balance)
				const percentClean = amountInput.replace(/%/g, '').trim()
				if (!percentClean || isNaN(Number(percentClean))) {
					usdVal = null
					break
				}
				try {
					usdVal = percentOfBalanceToUsd(percentClean, balanceDec, price)
				} catch (error) {
					usdVal = null
				}
				break
			}
			case Mode.Text: {
				try {
					usdVal = textCommandToUsd(amountInput, balance, price)
				} catch (error) {
					usdVal = null
				}
				break
			}
		}

		return { usd: usdVal, token: null }
	}, [amountInput, amountInputMode, balance, price])

	return {
		usd,
		token,
		isValid: usd !== null && price.gt(0),
		rawUsd: usd?.replace('$', '') || null,
		isUsdMode: amountInputMode === Mode.Dollar,
	}
}
