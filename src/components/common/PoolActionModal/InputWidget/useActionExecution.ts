import type { PoolsActionAction } from '../Reducer/types'
import {
	POOLS_CHAIN_ID,
	PARENT_POOL_ADDRESS,
	POOLS_LP_TOKEN_ADDRESS,
	POOLS_USDC_ADDRESS,
} from '@/configuration/pools'
import { getWalletClient } from '@/providers/Web3Provider/Web3Provider'
import { handleDeposit } from '@/handlers/deposit'
import { handleWithdrawal } from '@/handlers/withdrawal'
import { PoolsActionType } from '../Reducer/types'
import { switchChain } from 'viem/actions'

export const useActionExecution = (
	amount: bigint,
	dispatch: React.Dispatch<PoolsActionAction>,
	type: PoolsActionType,
) => {
	const execute = async (): Promise<void> => {
		try {
			const client = await getWalletClient(POOLS_CHAIN_ID)
			if (client.chain?.id !== POOLS_CHAIN_ID) {
				await switchChain(client, { id: POOLS_CHAIN_ID })
			}

			switch (type) {
				case PoolsActionType.Deposit:
					await handleDeposit(
						client,
						POOLS_CHAIN_ID,
						PARENT_POOL_ADDRESS,
						POOLS_USDC_ADDRESS,
						amount,
						dispatch,
					)
					break
				case PoolsActionType.Withdraw:
					await handleWithdrawal(
						client,
						POOLS_CHAIN_ID,
						PARENT_POOL_ADDRESS,
						POOLS_LP_TOKEN_ADDRESS,
						amount,
						dispatch,
					)
					break
				default:
					throw new Error(`Unsupported action type: ${type}`)
			}
		} catch (error) {
			console.error('Transaction execution failed:', error)
			throw error
		}
	}

	return { execute }
}
