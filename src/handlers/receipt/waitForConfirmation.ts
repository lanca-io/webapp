import type {
	Client,
	Hash,
	TransactionReceipt,
	ReplacementReturnType,
	Chain,
	ReplacementReason,
} from 'viem'
import { getPublicClient } from '@/providers/Web3Provider/Web3Provider'
import { waitForReceipt } from './waitForReceipt'

export const waitForConfirmation = async (
	client: Client,
	chainId: number,
	txHash: Hash,
	onReplaced?: (response: ReplacementReturnType<Chain | undefined>) => void,
): Promise<{ receipt?: TransactionReceipt; reason?: ReplacementReason }> => {
	let { receipt, reason } = await waitForReceipt(client, txHash, onReplaced)

	if (!receipt?.status) {
		const client: Client = await getPublicClient(chainId)
		const result = await waitForReceipt(client, txHash, onReplaced)
		receipt = result.receipt
		reason = result.reason
	}

	return { receipt, reason }
}
