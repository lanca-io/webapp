import { type ISwapDirectionData } from '@lanca/sdk'
import { TokenAmounts } from '../../../../../utils/TokenAmounts'

interface PriceImpactProps {
	from: ISwapDirectionData
	to: ISwapDirectionData
}

export const getPriceImpact = ({ from, to }: PriceImpactProps) => {
	const fromAmount = new TokenAmounts(from.amount, from.token.decimals)
	const toAmount = new TokenAmounts(to.amount, to.token.decimals)

	const amountUsdFrom = from.amount ? Number(fromAmount.toParsedAmount()) * Number(from.token.priceUsd) : 0
	const amountUsdTo = to.amount ? Number(toAmount.toParsedAmount()) * Number(to.token.priceUsd) : 0

	const totalFees = amountUsdFrom - amountUsdTo < 0 ? 0 : amountUsdFrom - amountUsdTo
	const priceImpact = (totalFees / amountUsdFrom) * 100

	return { totalFees, priceImpact }
}
