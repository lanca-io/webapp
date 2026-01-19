import type { Client, Chain, Address } from 'viem'
import { getMinWithdrawal } from './getMinWithdrawal'
import { queueWithdrawal } from './queueWithdrawal'
import { handleAllowance } from '../allowance'

export const handleWithdrawal = async (
	client: Client,
	chain: Chain,
	pool: Address,
	token: Address,
	amount: bigint,
): Promise<boolean> => {
	if (!client.account) throw new Error('[Lanca]: No account found in client')

	try {
		await handleAllowance(client, chain, token, client.account.address, amount)

		const minWithdraw = await getMinWithdrawal(client, pool)
		if (amount < minWithdraw) {
			throw new Error(
				`[Lanca]: Withdrawal amount ${amount} is less than minimum required ${minWithdraw}`,
			)
		}

		await queueWithdrawal(client, chain, pool, amount)
		return true
	} catch (e) {
		throw new Error(`[Lanca]: Withdrawal handling failed: ${e}`)
	}
}
