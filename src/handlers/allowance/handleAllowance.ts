import type { Address, Client } from 'viem'
import { getAllowance } from './getAllowance'
import { setAllowance } from './setAllowance'

export const handleAllowance = async (
	client: Client,
	chainId: number,
	token: Address,
	spender: Address,
	amount: bigint,
): Promise<boolean> => {
	if (!client.account) throw new Error('[Lanca]: No account found in client')
	try {
		const allowance = await getAllowance(
			client,
			token,
			client.account.address,
			spender,
		)

		if (allowance >= amount) return true

		await setAllowance(client, chainId, token, spender, amount)
		const newAllowance = await getAllowance(
			client,
			token,
			client.account.address,
			spender,
		)
		if (newAllowance < amount) {
			throw new Error(
				`[Lanca]: Allowance not set correctly. Expected at least ${amount}, got ${newAllowance}`,
			)
		}
		return true
	} catch (e) {
		throw new Error(`[Lanca]: Handle allowance failed: ${e}`)
	}
}
