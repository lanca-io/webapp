import { getPublicClient } from '../../../../sdk/configs/chainsConfig'
import { type RouteData } from '../../../../sdk/types/routeTypes'
import { type Address, formatUnits } from 'viem'
import { conceroAddressesMap } from '../../../../sdk/configs/conceroAddressesMap'
import { fetchTokens } from '../../../../api/concero/fetchTokens'
import { config } from '../../../../constants/config'

const getUsdPrice = async (chainId: string) => {
	try {
		const response = await fetchTokens({ chainId, address: config.NULL_ADDRESS, offset: 0, limit: 1 })
		return response[0].priceUsd
	} catch (error) {
		console.error('Error usd eth cost:', error)
	}
}

export const getContractGas = async (routeData: RouteData, address: Address) => {
	if (!routeData || !address) return 'n/a'

	const publicClient = getPublicClient(routeData.from.chain.id)
	const conceroContract = conceroAddressesMap[routeData.from.chain.id]

	const estimatedGas = await publicClient.estimateGas({
		account: address,
		to: conceroContract,
	})
	const gasPrice = await publicClient.getGasPrice()

	const gasCost = Number(formatUnits(gasPrice, 18)) * Number(estimatedGas)
	const gasTokenUsdPrice = await getUsdPrice(routeData.from.chain.id)
	const gasCostInUSD = gasCost * gasTokenUsdPrice

	return gasCostInUSD.toFixed(6)
}
