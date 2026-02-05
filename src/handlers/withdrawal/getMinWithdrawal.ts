import type { Address, Client } from 'viem'
import { poolsAbi } from '@/abi/PoolsAbi'
import { readContract } from 'viem/actions'

export const getMinWithdrawal = async (
	client: Client,
	pool: Address,
): Promise<bigint> => {
	const result = (await readContract(client, {
		address: pool,
		abi: poolsAbi,
		functionName: 'getMinWithdrawalAmount',
	})) as bigint
	return result
}
