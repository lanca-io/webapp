import { getPublicClient } from '../../../../sdk/configs/chainsConfig'
import { type RouteData } from '../../../../sdk/types/routeTypes'
import { type Address, formatEther } from 'viem'
import { conceroAddressesMap } from '../../../../sdk/configs/conceroAddressesMap'
import { fetchTokens } from '../../../../api/concero/fetchTokens'
import { config } from '../../../../constants/config'
import { type Token } from '../../../../api/concero/types'

const getUsdPrice = async (chainId: string): Promise<Token | null> => {
	try {
		const response = await fetchTokens({ chainId, address: config.NULL_ADDRESS, offset: 0, limit: 1 })
		return response[0]
	} catch (error) {
		console.error('Error usd eth cost:', error)
		return null
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

	const gasCost = Number(formatEther(gasPrice)) * Number(estimatedGas)
	const gasToken = await getUsdPrice(routeData.from.chain.id)

	if (!gasToken) return 'n/a'

	const gasCostInUSD = gasCost * gasToken.priceUsd!
	return gasCostInUSD.toFixed(6)
}
