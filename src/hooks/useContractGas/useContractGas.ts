import { type Address, formatEther } from 'viem'
import { fetchTokens } from '../../api/concero/fetchTokens'
import { config } from '../../constants/config'
import { type Token } from '../../api/concero/types'
import { gasUsedMap } from './gasPriceMap'
import { type IRouteType, StepType, type TxName } from 'lanca-sdk-demo'
import { getPublicClient } from '../../web3/wagmi'

const getUsdPrice = async (chainId: string): Promise<Token | null> => {
	try {
		const response = await fetchTokens({ chainId, address: config.NULL_ADDRESS, offset: 0, limit: 1 })
		return response[0]
	} catch (error) {
		console.error('Error fetching USD price:', error)
		return null
	}
}

export const useContractGas = async (routeData: IRouteType, address: Address): Promise<string> => {
	if (!routeData || !address) return 'n/a'

	const toolTypes = routeData.steps.map(step => step.type)

	const hasSwap = toolTypes.some(toolType => toolType === StepType.SRC_SWAP || toolType === StepType.DST_SWAP)
	const hasBridge = toolTypes.some(toolType => toolType === StepType.BRIDGE)

	const txName: TxName = hasSwap && hasBridge ? 'swapAndBridge' : hasBridge ? 'bridge' : 'swap'

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
