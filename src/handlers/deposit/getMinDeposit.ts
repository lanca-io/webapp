import type { Address, Client } from 'viem'
import { poolsAbi } from '@/abi/PoolsAbi'
import { readContract } from 'viem/actions'

export const getMinDeposit = async (
	client: Client,
	pool: Address,
): Promise<bigint> => {
	try {
		const result = (await readContract(client, {
			address: pool,
			abi: poolsAbi,
			functionName: 'getMinDepositAmount',
		})) as bigint
		return result
	} catch (e) {
		throw new Error(`[Lanca]: Error getting minimum deposit amount - ${e}`)
	}
}
