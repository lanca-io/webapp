import { type ISwapDirectionData } from '@lanca/sdk'
import { TokenAmounts } from '../../../../../utils/TokenAmounts'

interface PriceImpactProps {
	from: ISwapDirectionData
	fees: any[]
}

const sumFees = (fees: any[]): number => {
	let total = 0

	if (Array.isArray(fees)) {
		for (const fee of fees) {
			if (fee.token && fee.token.decimals !== undefined && fee.token.priceUsd !== undefined) {
				const feeAmount = Number(fee.amount) / 10 ** fee.token.decimals
				total += feeAmount * Number(fee.token.priceUsd)
			}
		}
	}

	return total
}

export const getPriceImpact = ({ from, fees }: PriceImpactProps) => {
	const fromAmount = new TokenAmounts(from.amount, from.token.decimals)

	const amountUsdFrom = from.amount ? Number(fromAmount.toParsedAmount()) * Number(from.token.priceUsd) : 0

	const totalFees = sumFees(fees)
	const priceImpact = amountUsdFrom > 0 ? ((totalFees - amountUsdFrom) / amountUsdFrom) * 100 : 0

	return { totalFees, priceImpact }
}

// toAmount - fromAmount - totalFees = positive positive price impact
