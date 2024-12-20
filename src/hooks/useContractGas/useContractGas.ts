import { type Address, formatEther } from 'viem'
import { fetchTokens } from '../../api/concero/fetchTokens'
import { config } from '../../constants/config'
import { type Token } from '../../api/concero/types'
import { gasUsedMap } from './gasPriceMap'
import { publicClient } from '../../web3/wagmi'
import { type RouteType } from 'lanca-sdk-demo'

const getUsdPrice = async (chainId: string): Promise<Token | null> => {
	try {
		const response = await fetchTokens({ chainId, address: config.NULL_ADDRESS, offset: 0, limit: 1 })
		return response[0]
	} catch (error) {
		console.error('Error usd eth cost:', error)
		return null
	}
}

export const useContractGas = async (routeData: RouteType, address: Address) => {
	if (!routeData || !address) return 'n/a'

	const toolTypes = routeData.steps.map((step: any) => ({
		toolType: step.tool.type,
	}))

	const hasSwap = toolTypes.some(tool => tool.toolType === 'swap')
	const hasBridge = toolTypes.some(tool => tool.toolType === 'bridge')

	let txName: 'swap' | 'bridge' | 'swapAndBridge' = 'swap'

	if (hasSwap && hasBridge) {
		txName = 'swapAndBridge'
	} else if (!hasSwap && hasBridge) {
		txName = 'bridge'
	}
	const estimatedGas = gasUsedMap[Number(routeData.from.chain.id)]

	const gasPrice = await publicClient.getGasPrice()

	const gasCost = Number(formatEther(gasPrice)) * Number(estimatedGas[txName])
	const gasToken = await getUsdPrice(routeData.from.chain.id)

	if (!gasToken) return 'n/a'

	const gasCostInUSD = gasCost * gasToken.priceUsd!
	return gasCostInUSD.toFixed(6)
}
