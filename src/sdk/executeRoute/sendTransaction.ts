import type { InputRouteData, SwapArgs, TxName } from '../types/contractInputTypes'
import { type Address, type PublicClient, type WalletClient } from 'viem'
import { conceroAbi } from './conceroOrchestratorAbi'

export const sendTransaction = async (
	txArgs: InputRouteData,
	publicClient: PublicClient,
	walletClient: WalletClient,
	conceroAddress: Address,
	clientAddress: Address,
) => {
	const { srcSwapData, bridgeData, dstSwapData } = txArgs

	let txName: TxName = 'swap'
	let args: SwapArgs = [srcSwapData, clientAddress]

	console.log(args)

	if (srcSwapData.length > 0 && bridgeData) {
		txName = 'swapAndBridge'
		args = [bridgeData, srcSwapData, dstSwapData]
	}
	if (srcSwapData.length === 0 && bridgeData) {
		txName = 'bridge'
		args = [bridgeData, dstSwapData]
	}

	console.log('args', args)

	// const { request } = await publicClient.simulateContract({
	// 	account: clientAddress,
	// 	abi: ConceroJson.abi,
	// 	functionName: txName,
	// 	address: conceroAddress,
	// 	args,
	// })
	//
	// const approveTxHash = await walletClient.writeContract(request)

	return await walletClient.writeContract({
		account: clientAddress,
		abi: conceroAbi,
		functionName: txName,
		address: conceroAddress,
		args,
		gas: 4_000_000n,
	})
}
