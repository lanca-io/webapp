import { getPublicClient } from '../../../../sdk/configs/chainsConfig'
import { type RouteData } from '../../../../sdk/types/routeTypes'
import { type Address, formatUnits } from 'viem'
import axios from 'axios'

const getEthUsdPrice = async () => {
	try {
		const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd')
		return response.data.ethereum.usd
	} catch (error) {
		console.error('Error usd eth cost:', error)
	}
}

export const getContractGas = async (routeData: RouteData, address: Address) => {
	if (!routeData || !address) return 'n/a'

	const publicClient = getPublicClient(routeData.from.chain.id)

	const gasQuantity = await publicClient.estimateGas({
		account: address,
		to: address,
	})

	const gasPrice = await publicClient.getGasPrice()
	const ethUsdPrice = await getEthUsdPrice()
	const gasPriceInUsd = ethUsdPrice * Number(formatUnits(gasPrice, 18))

	console.log({ gasQuantity, gasPrice, gasPriceInUsd })

	return (gasPriceInUsd * Number(gasQuantity)).toFixed(6)
}
