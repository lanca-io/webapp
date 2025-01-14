import { type SwapDirectionData } from 'lanca-sdk-demo'

interface PriceImpactProps {
	from: SwapDirectionData
	to: SwapDirectionData
}

export const getPriceImpact = ({ from, to }: PriceImpactProps) => {
	const amountUsdFrom = from.amount ? Number(from.amount) * Number(from.token.priceUsd) : 0
	const amountUsdTo = to.amount ? Number(to.amount) * Number(to.token.priceUsd) : 0

	const totalFees = amountUsdFrom - amountUsdTo < 0 ? 0 : amountUsdFrom - amountUsdTo
	const priceImpact = (totalFees / amountUsdFrom) * 100

	return { totalFees, priceImpact }
}
