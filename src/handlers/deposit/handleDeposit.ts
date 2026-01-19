import type { Client, Chain, Address } from 'viem'
import { handleAllowance } from '../allowance'
import { getMinDeposit } from './getMinDeposit'
import { queueDeposit } from './queueDeposit'

export const handleDeposit = async (
	client: Client,
	chain: Chain,
	pool: Address,
	token: Address,
	amount: bigint,
): Promise<boolean> => {
	if (!client.account) throw new Error('[Lanca]: No account found in client')
	try {
		await handleAllowance(client, chain, token, client.account.address, amount)

		const minDeposit = await getMinDeposit(client, pool)

		if (amount < minDeposit) {
			throw new Error(
				`[Lanca]: Deposit amount ${amount} is less than minimum required ${minDeposit}`,
			)
		}

		await queueDeposit(client, chain, pool, amount)
		return true
	} catch (e) {
		throw new Error(`[Lanca]: Deposit allowance handling failed: ${e}`)
	}
}
