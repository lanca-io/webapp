import { type Address, formatEther } from 'viem'
import { gasUsedMap } from './gasPriceMap'
import { type IRouteType, StepType, type TxName } from '@lanca/sdk'
import { handleFetchTokens } from '../../handlers/tokens'
import { getPublicClient } from '../../providers/Web3Provider/Web3Provider'
import { zeroAddress } from 'viem'

const getUsdPrice = async (chainId: string) => {
	try {
		const response = await handleFetchTokens(
			chainId,
			0,
			1,
			undefined,
			zeroAddress,
		)
		return response[0]
	} catch (error) {
		console.error('Error fetching USD price:', error)
		return null
	}
}

export const useContractGas = async (
	routeData: IRouteType,
	address: Address,
): Promise<string> => {
	if (!routeData || !address) return 'n/a'

	const toolTypes = routeData.steps.map(step => step.type)

	const hasSwap = toolTypes.some(
		toolType =>
			toolType === StepType.SRC_SWAP || toolType === StepType.DST_SWAP,
	)
	const hasBridge = toolTypes.some(toolType => toolType === StepType.BRIDGE)

	const txName: TxName =
		hasSwap && hasBridge ? 'swapAndBridge' : hasBridge ? 'bridge' : 'swap'

	const chainId = Number(routeData.from.chain.id)
	const estimatedGas = gasUsedMap[chainId]
	if (!estimatedGas) return 'n/a'

	try {
		const gasPrice = await getPublicClient(chainId).getGasPrice()
		const gasCost = Number(formatEther(gasPrice)) * Number(estimatedGas[txName])
		const gasToken = await getUsdPrice(routeData.from.chain.id)
		if (!gasToken) return 'n/a'

		const gasCostInUSD = gasCost * gasToken.priceUsd!
		return gasCostInUSD.toFixed(6)
	} catch (error) {
		console.error('Error calculating gas cost:', error)
		return 'n/a'
	}
}
