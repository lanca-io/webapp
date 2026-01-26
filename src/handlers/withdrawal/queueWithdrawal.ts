import type { Address, Client } from 'viem'
import { sendTransaction, simulateContract } from 'viem/actions'
import { waitForConfirmation } from '../receipt'
import { poolsAbi } from '@/abi/PoolsAbi'

export const queueWithdrawal = async (
	client: Client,
	chainId: number,
	pool: Address,
	amount: bigint,
): Promise<boolean> => {
	if (!client.account) throw new Error('[Lanca]: No account')

	const { request } = await simulateContract(client, {
		account: client.account,
		address: pool,
		abi: poolsAbi,
		functionName: 'enterWithdrawalQueue',
		args: [amount],
	})

	const txHash = await sendTransaction(client, {
		...request,
		to: pool,
		value: 0n,
	})

	if (!txHash) throw new Error('[Lanca]: Transaction dropped from mempool')

	const { receipt, reason } = await waitForConfirmation(client, chainId, txHash)

	if (!receipt || receipt.status === 'reverted') {
		throw new Error(
			`[Lanca]: Withdrawal queue failed${reason ? ` due to ${reason}` : ''}`,
		)
	}

	return true
}
