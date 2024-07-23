import type { RouteData } from '../types/routeTypes'
import { type Address, parseUnits } from 'viem'
import type { BridgeData, InputSwapData } from '../types/contractInputTypes'
import { createBigIntAmount } from '../utils/formatting'
import { chainSelectorsMap } from '../configs/chainSelectorsMap'
import { buildDexData } from './buildDexData'

const dexTypesMap: Record<string, number> = {
	uniswapV3Single: 3,
	uniswapV3Multi: 5,
	wrapNative: 9,
	unwrapWNative: 10,
}

export const buildRouteData = (routeData: RouteData, clientAddress: Address) => {
	const { steps } = routeData

	let bridgeData: BridgeData | null = null
	const srcSwapData: InputSwapData[] = []
	const dstSwapData: InputSwapData[] = []

	for (let i = 0; i < steps.length; i++) {
		const currentStep = steps[i]

		const { from, to, tool } = currentStep
		const { type } = currentStep.tool

		const fromAmount = parseUnits(from.amount, from.token.decimals)
		const toAmount = parseUnits(to.amount, to.token.decimals)

		if (type === 'bridge') {
			bridgeData = {
				tokenType: 1,
				amount: fromAmount,
				dstChainSelector: BigInt(chainSelectorsMap[to.chainId]),
				receiver: clientAddress,
			}

			continue
		}

		if (type === 'swap') {
			const dexData = buildDexData(currentStep, clientAddress)

			const swapData = {
				dexType: dexTypesMap[tool.name],
				fromToken: from.token.address,
				fromAmount,
				toToken: to.token.address,
				toAmount,
				toAmountMin: createBigIntAmount(tool.additional_info.outputAmountMin, to.token.decimals),
				dexData,
			}

			// if bridgeData does not exist, then it is src step
			// or it exist, then it is dst step
			bridgeData ? dstSwapData.push(swapData) : srcSwapData.push(swapData)
		}
	}

	return { srcSwapData, bridgeData, dstSwapData }
}
