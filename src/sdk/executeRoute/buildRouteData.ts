import type { RouteData } from '../types/routeTypes'
import { type Address, encodeAbiParameters, parseUnits, zeroAddress } from 'viem'
import { type BridgeData, type InputRouteData, type InputSwapData, type Integration } from '../types/contractInputTypes'
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

export const buildRouteData = (routeData: RouteData, clientAddress: Address): InputRouteData => {
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

			if (isDstSwapData) {
				dstSwapData.push(swapStep)
			} else {
				srcSwapData.push(swapStep)
			}
		}
	}

	const integration: Integration = {
		integrator: zeroAddress,
		feeBps: 0,
	}

	if (dstSwapData.length > 0) {
		const encodedSwapStep = encodeAbiParameters(swapDataAbiParams, [dstSwapData])
		const compresedSwapStep = solady.LibZip.cdCompress(encodedSwapStep)

		return { srcSwapData, bridgeData, dstSwapData: compresedSwapStep, integration }
	}

	return { srcSwapData, bridgeData, dstSwapData: '', integration }
}
