import { type Address, erc20Abi, parseUnits, type PublicClient, type WalletClient } from 'viem'
import type { SwapDirectionData } from '../types/routeTypes'
import { conceroAddressesMap } from '../configs/conceroAddressesMap'
import { ExecuteRouteStage, type ExecutionState } from '../types/executeSettingsTypes'
import { config } from '../../constants/config'

export const checkAllowanceAndApprove = async (
	walletClient: WalletClient,
	publicClient: PublicClient,
	txData: SwapDirectionData,
	clientAddress: Address,
	sendState: (state: ExecutionState) => void,
) => {
	const { token, amount, chain } = txData

	if (token.address === config.NULL_ADDRESS) {
		return
	}

	const conceroAddress = conceroAddressesMap[chain.id]

	const allowance = await publicClient.readContract({
		abi: erc20Abi,
		functionName: 'allowance',
		address: token.address,
		args: [clientAddress, conceroAddress],
	})

	let approveTxHash = null

	const amountInDecimals = parseUnits(amount, token.decimals)

	if (allowance < amountInDecimals) {
		sendState({
			stage: ExecuteRouteStage.awaitApprove,
			payload: {
				title: 'Signature required',
				body: 'Please check info and approve the transaction in your wallet',
				status: 'await',
				txLink: null,
			},
		})

		const { request } = await publicClient.simulateContract({
			account: clientAddress,
			address: token.address,
			abi: erc20Abi,
			functionName: 'approve',
			args: [conceroAddress, amountInDecimals],
		})

		approveTxHash = await walletClient.writeContract(request)

		sendState({
			stage: ExecuteRouteStage.pendingApprove,
			payload: {
				title: 'Pennding',
				body: '',
				status: 'await',
				txLink: null,
			},
		})
	}

	if (approveTxHash) {
		await publicClient.waitForTransactionReceipt({ hash: approveTxHash })
	}
}
