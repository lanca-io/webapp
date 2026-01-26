import type { Address, Client } from 'viem'
import { sendTransaction, simulateContract } from 'viem/actions'
import { waitForConfirmation } from '../receipt/waitForConfirmation'
import { erc20Abi } from 'viem'

export const setAllowance = async (
	client: Client,
	chainId: number,
	token: Address,
	spender: Address,
	amount: bigint,
): Promise<Boolean> => {
	if (!client.account) throw new Error('[Lanca]: No account')

	const { request } = await simulateContract(client, {
		account: client.account,
		address: token,
		abi: erc20Abi,
		functionName: 'approve',
		args: [spender, amount],
	})

	const txHash = await sendTransaction(client, {
		...request,
		to: token,
		value: 0n,
	})

	if (!txHash) throw new Error('[Lanca]: Transaction dropped from mempool')

	const { receipt, reason } = await waitForConfirmation(client, chainId, txHash)

	if (!receipt || receipt.status === 'reverted') {
		throw new Error(
			`[Lanca]: Approval failed${reason ? ` due to ${reason}` : ''}`,
		)
	}

	return true
}
