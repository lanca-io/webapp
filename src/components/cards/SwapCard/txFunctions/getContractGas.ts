import { getPublicClient, viemChains } from '../../../../sdk/configs/chainsConfig'
import { type RouteData } from '../../../../sdk/types/routeTypes'
import { type Address, createWalletClient, custom, erc20Abi, formatEther, parseUnits } from 'viem'
import { conceroAddressesMap } from '../../../../sdk/configs/conceroAddressesMap'
import { fetchTokens } from '../../../../api/concero/fetchTokens'
import { config } from '../../../../constants/config'
import { type Token } from '../../../../api/concero/types'
import type { InputRouteData, SwapArgs, TxName } from '../../../../sdk/types/contractInputTypes'
import { buildRouteData } from '../../../../sdk/executeRoute/buildRouteData'
import { conceroAbi } from '../../../../sdk/executeRoute/conceroOrchestratorAbi'

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

	const { srcSwapData, dstSwapData, bridgeData }: InputRouteData = buildRouteData(routeData, address)

	let txName: TxName = 'swap'
	let args: SwapArgs = [srcSwapData, address]

	if (srcSwapData.length > 0 && bridgeData) {
		txName = 'swapAndBridge'
		args = [bridgeData, srcSwapData, dstSwapData]
	}
	if (srcSwapData.length === 0 && bridgeData) {
		txName = 'bridge'
		args = [bridgeData, dstSwapData]
	}

	// const allowance = await publicClient.readContract({
	// 	abi: erc20Abi,
	// 	functionName: 'allowance',
	// 	address: routeData.from.token.address,
	// 	args: [address, conceroContract],
	// })
	//
	// const { request } = await publicClient.simulateContract({
	// 	account: address,
	// 	address: routeData.from.token.address,
	// 	abi: erc20Abi,
	// 	functionName: 'approve',
	// 	args: [conceroContract, parseUnits(routeData.from.amount, routeData.from.token.decimals)],
	// })
	//
	// const walletClient = createWalletClient({
	// 	chain: viemChains[routeData.from.chain.id].chain,
	// 	transport: custom(window.ethereum),
	// })

	// await walletClient.switchChain({ id: Number(routeData.from.chain.id) })
	// const approveTxHash = await walletClient.writeContract(request)

	const estimatedGas = await publicClient.estimateGas({
		account: address,
		to: conceroContract,
	})

	const gasPrice = await publicClient.getGasPrice()

	const gasLimit = await publicClient.estimateContractGas({
		account: address,
		abi: conceroAbi,
		functionName: txName,
		address: conceroContract,
		args,
		gas: 3000000n,
		gasPrice,
		chain: publicClient.chain,
	})

	console.log('gasLimit', gasLimit)

	const gasCost = Number(formatEther(gasPrice)) * Number(gasLimit)
	const gasToken = await getUsdPrice(routeData.from.chain.id)

	if (!gasToken) return 'n/a'

	const gasCostInUSD = gasCost * gasToken.priceUsd!

	return gasCostInUSD.toFixed(6)
}
