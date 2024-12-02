import type { RouteData } from '../types/routeTypes'
import { type Address, encodeAbiParameters, parseUnits, zeroAddress } from 'viem'
import type { BridgeData, InputSwapData } from '../types/contractInputTypes'
import { createBigIntAmount } from '../utils/formatting'
import { chainSelectorsMap } from '../configs/chainSelectorsMap'
import { buildDexData } from './buildDexData'
import { swapDataAbiParams } from '../assets/swapDataAbiParameters'
import * as solady from 'solady'

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
	const dstSwapData: string[] = []

	for (let i = 0; i < steps.length; i++) {
		const currentStep = steps[i]

		const { from, to, tool } = currentStep
		const { type } = currentStep.tool

		const fromAmount = parseUnits(from.amount, from.token.decimals)
		const toAmount = parseUnits(to.amount, to.token.decimals)

		if (type === 'bridge') {
			bridgeData = {
				amount: fromAmount,
				dstChainSelector: BigInt(chainSelectorsMap[to.chainId]),
				receiver: clientAddress,
			}

			continue
		}

		if (type === 'swap') {
			const dexData = buildDexData(currentStep, clientAddress)

			const swapStep = {
				dexType: dexTypesMap[tool.name],
				fromToken: from.token.address,
				fromAmount,
				toToken: to.token.address,
				toAmount,
				toAmountMin: createBigIntAmount(tool.additional_info.outputAmountMin, to.token.decimals),
				dexData,
			}

			const isDstSwapData = !!bridgeData

			// if bridgeData does not exist, then it is src step
			// or it exist, then it is dst step
			if (isDstSwapData) {
				dstSwapData.push(swapStep)
			} else {
				srcSwapData.push(swapStep)
			}
		}
	}

	const integratorData = {
		integrator: zeroAddress,
		feeBps: 0,
	}

	if (dstSwapData) {
		const encodedSwapStep = encodeAbiParameters(swapDataAbiParams, [dstSwapData])
		const compresedSwapStep = solady.LibZip.cdCompress(encodedSwapStep)

		console.log(compresedSwapStep)

		return { srcSwapData, bridgeData, dstSwapData: compresedSwapStep, integratorData }
	}

	return { srcSwapData, bridgeData, dstSwapData, integratorData }
}
