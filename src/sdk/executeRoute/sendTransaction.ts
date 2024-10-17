import type { InputRouteData, SwapArgs, TxName } from '../types/contractInputTypes'
import { type Address, type PublicClient, type WalletClient } from 'viem'
import { conceroAbi } from './conceroOrchestratorAbi'
import { config } from '../../constants/config'
import { ExecuteRouteStage, type ExecutionState } from '../types/executeSettingsTypes'

export const sendTransaction = async (
	txArgs: InputRouteData,
	publicClient: PublicClient,
	walletClient: WalletClient,
	conceroAddress: Address,
	clientAddress: Address,
	sendState: (state: ExecutionState) => void,
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

	const gasPrice = await publicClient.getGasPrice()
	const isFromNativeToken = srcSwapData.length > 0 && srcSwapData[0].fromToken === config.NULL_ADDRESS

	sendState({
		stage: ExecuteRouteStage.confirmingTransaction,
		payload: {
			title: 'Confirm Transaction',
			body: 'Waiting for confirming transaction...',
			status: 'await',
			txLink: null,
		},
	})

	return await walletClient.writeContract({
		account: clientAddress,
		abi: conceroAbi,
		functionName: txName,
		address: conceroAddress,
		args,
		gas: 3000000n,
		gasPrice,
		chain: publicClient.chain,
		...(isFromNativeToken && { value: srcSwapData[0].fromAmount }),
	})
}
