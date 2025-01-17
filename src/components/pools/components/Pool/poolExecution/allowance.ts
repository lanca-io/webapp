import { StageType, type PoolAction, type PoolState, PoolActionType } from '../poolReducer/types'
import { type Address, erc20Abi, parseUnits, type WalletClient } from 'viem'
import { type Dispatch } from 'react'
import { parentPoolBase } from '../../../config/poolMainnetAddresses'
import { parentPoolBaseSepolia } from '../../../config/poolTestnetAddresses'
import { config } from '../../../../../constants/config'
import { base } from 'viem/chains'

const parentPool = config.IS_TESTNET ? parentPoolBaseSepolia : parentPoolBase

export async function handleAllowance(
	poolState: PoolState,
	poolDispatch: Dispatch<PoolAction>,
	publicClient: any,
	walletClient: WalletClient,
) {
	const { from } = poolState
	const parsedAmount = parseUnits(from.amount, from.token.decimals)

	try {
		const allowanceCheck = await publicClient.readContract({
			abi: erc20Abi,
			functionName: 'allowance',
			address: from.token.address as Address,
			args: [from.address as Address, parentPool],
		})

		if (allowanceCheck >= parsedAmount) return

		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [
				{
					title: 'Approval required',
					body: 'Please approve the fund transfer in your wallet',
					type: StageType.approve,
					status: 'await',
				},
			],
		})

		const approveTx = await walletClient.writeContract({
			account: from.address as Address,
			abi: erc20Abi,
			functionName: 'approve',
			address: from.token.address as Address,
			args: [parentPool, parsedAmount],
			gas: 100_000n,
			chain: base,
		})

		const { status } = await publicClient.waitForTransactionReceipt({
			hash: approveTx,
		})

		if (status === 'reverted') {
			poolDispatch({
				type: PoolActionType.SET_SWAP_STEPS,
				payload: [{ title: 'Approval failed', status: 'error', type: StageType.approve }],
			})
			throw new Error('Approve transaction reverted')
		}

		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [{ title: 'Pending approval', status: 'pending', type: StageType.approve }],
		})
	} catch (error) {
		console.error('Error during allowance handling:', error)
		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [{ title: 'Approval failed', status: 'error', type: StageType.approve }],
		})
		throw error
	}
}
