import type { Address, Client } from 'viem'
import { erc20Abi } from 'viem'
import { readContract } from 'viem/actions'

export const getAllowance = async (
	client: Client,
	token: Address,
	owner: Address,
	spender: Address,
): Promise<bigint> => {
	try {
		const result = await readContract(client, {
			address: token,
			abi: erc20Abi,
			functionName: 'allowance',
			args: [owner, spender],
		})
		return result
	} catch (e) {
		throw new Error(`[Lanca]: Error getting allowance - ${e}`)
	}
}
