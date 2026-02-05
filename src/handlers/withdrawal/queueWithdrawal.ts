import type { Address, Client } from 'viem'
import {
	estimateContractGas,
	estimateFeesPerGas,
	simulateContract,
	writeContract,
} from 'viem/actions'
import { waitForConfirmation } from '../receipt'
import { poolsAbi } from '@/abi/PoolsAbi'

export const queueWithdrawal = async (
	client: Client,
	chainId: number,
	pool: Address,
	amount: bigint,
): Promise<boolean> => {
	if (!client.account) throw new Error('[Lanca]: No account')

	await simulateContract(client, {
		account: client.account,
		address: pool,
		abi: poolsAbi,
		functionName: 'enterWithdrawalQueue',
		args: [amount],
	})

	const [gas, gasFees] = await Promise.all([
		estimateContractGas(client, {
			account: client.account,
			address: pool,
			abi: poolsAbi,
			functionName: 'enterWithdrawalQueue',
			args: [amount],
		}),
		estimateFeesPerGas(client, {
			type: 'eip1559',
			chain: client.chain,
		}),
	])

	const gasLimit: bigint = (gas * 13n) / 10n

	const txHash = await writeContract(client, {
		account: client.account,
		address: pool,
		abi: poolsAbi,
		functionName: 'enterWithdrawalQueue',
		args: [amount],
		gas: gasLimit,
		maxFeePerGas: gasFees.maxFeePerGas,
		maxPriorityFeePerGas: gasFees.maxPriorityFeePerGas,
		chain: client.chain,
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
