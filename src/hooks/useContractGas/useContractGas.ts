import { getPublicClient } from '../../sdk/configs/chainsConfig'
import { type RouteData } from '../../sdk/types/routeTypes'
import { type Address, formatEther } from 'viem'
import { conceroAddressesMap } from '../../sdk/configs/conceroAddressesMap'
import { fetchTokens } from '../../api/concero/fetchTokens'
import { config } from '../../constants/config'
import { type Token } from '../../api/concero/types'
import { buildRouteData } from '../../sdk/executeRoute/buildRouteData'
import type { SwapArgs, TxName } from '../../sdk/types/contractInputTypes'
import { add } from 'husky'
import { gasUsedMap } from './gasPriceMap'

const getUsdPrice = async (chainId: string): Promise<Token | null> => {
	try {
		const response = await fetchTokens({ chainId, address: config.NULL_ADDRESS, offset: 0, limit: 1 })
		return response[0]
	} catch (error) {
		console.error('Error usd eth cost:', error)
		return null
	}
}

export const useContractGas = async (routeData: RouteData, address: Address) => {
	if (!routeData || !address) return 'n/a'

	const publicClient = getPublicClient(routeData.from.chain.id)
	// const conceroContract = conceroAddressesMap[routeData.from.chain.id]

	const args = buildRouteData(routeData, address)
	const { srcSwapData, bridgeData } = args

	let txName: TxName = 'swap'

	if (srcSwapData.length > 0 && bridgeData) {
		txName = 'swapAndBridge'
	}
	if (srcSwapData.length === 0 && bridgeData) {
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
