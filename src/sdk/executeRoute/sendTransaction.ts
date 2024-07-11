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

	if (srcSwapData.length > 0 && bridgeData) {
		txName = 'swapAndBridge'
		args = [bridgeData, srcSwapData, dstSwapData]
	}
	if (srcSwapData.length === 0 && bridgeData) {
		txName = 'bridge'
		args = [bridgeData, dstSwapData]
	}

	return await walletClient.writeContract({
		account: clientAddress,
		abi: conceroAbi,
		functionName: txName,
		address: conceroAddress,
		args,
		gas: 3_000_000n,
	})
}
