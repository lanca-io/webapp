import { type IRouteType, type IRouteStep } from '@lanca/sdk'
import { TokenAmounts } from '../../../../../utils/TokenAmounts'

const sumFeesInUsd = (fees: any[]): number => {
	console.log(fees)
	return fees.reduce((total, fee) => {
		if (fee.token && fee.token.decimals !== undefined && fee.token.priceUsd !== undefined) {
			const feeAmount = Number(fee.amount) / 10 ** fee.token.decimals
			return total + feeAmount * Number(fee.token.priceUsd)
		}
		return total
	}, 0)
}

export const getPriceImpact = (route: IRouteType) => {
	const { steps } = route
	const from = (steps[0] as IRouteStep).from
	const to = (steps[steps.length - 1] as IRouteStep).to
	const fees = steps.flatMap(step => ('fees' in step ? step.fees : []))

	const fromAmount = new TokenAmounts(from.amount, from.token.decimals)
	const toAmount = new TokenAmounts(to.amount, to.token.decimals)

	const amountUsdFrom = Number(fromAmount.toParsedAmount()) * Number(from.token.priceUsd)
	const amountUsdTo = Number(toAmount.toParsedAmount()) * Number(to.token.priceUsd)

	const totalFees = sumFeesInUsd(fees)

	const priceImpact = (totalFees / amountUsdFrom) * 100
	const netGainOrLoss = amountUsdFrom - amountUsdTo
	const isNetGain = netGainOrLoss < 0

	return { totalFees, priceImpact, netGainOrLoss, isNetGain }
}
