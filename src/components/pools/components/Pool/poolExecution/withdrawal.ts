import { type Address, type Hash, parseAbi, parseUnits, type WalletClient } from 'viem'
import { type PoolAction, PoolActionType, PoolCardStage, type PoolState, StageType } from '../poolReducer/types'
import { type Dispatch } from 'react'
import { config } from '../../../../../constants/config'
import { parentPoolBaseSepolia } from '../../../config/poolTestnetAddresses'
import { parentPoolBase } from '../../../config/poolMainnetAddresses'
import { base, baseSepolia } from 'viem/chains'
import { handleAllowance } from './allowance'
import { getPublicClient } from '../../../../../providers/Web3Provider/Web3Provider'
import { ParentPoolABI } from '../../../config/abi/ParentPoolABI1_5'
import { trackEvent } from '../../../../../hooks/useTracking'
import { category } from '../../../../../constants/tracking'

export enum TransactionStatus {
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
	PENDING = 'PENDING',
	IDLE = 'IDLE',
}

const parentPool = config.IS_TESTNET ? parentPoolBaseSepolia : parentPoolBase
const chain = config.IS_TESTNET ? baseSepolia : base
const publicClient = getPublicClient(chain.id)

const trackWithdrawalStatus = (status: 'SUCCESS' | 'FAILED', poolState: PoolState, txHash?: Hash) => {
	const { from } = poolState

	trackEvent({
		category: category.PoolCard,
		action: 'withdrawal_status',
		label: 'Withdrawal Status',
		data: {
			user_id: from.address,
			status: status,
			amount: from.amount,
			pool_id: parentPool,
			product: 'Lanca',
			txHash: txHash,
		},
	})
}

export async function handleWithdrawal(
	poolState: PoolState,
	poolDispatch: Dispatch<PoolAction>,
	walletClient: WalletClient,
) {
	const { to, from } = poolState

	if (to.amount === '' || to.amount === '0') return

	poolDispatch({ type: PoolActionType.SET_LOADING, payload: true })
	poolDispatch({ type: PoolActionType.SET_SWAP_STAGE, payload: PoolCardStage.progress })

	try {
		await walletClient.switchChain({ id: chain.id })
		await handleAllowance(poolState, poolDispatch, publicClient, walletClient)

		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [
				{ title: 'Approval required', status: 'success', type: StageType.approve },
				{ title: 'Withdrawal in progress...', status: 'pending', type: StageType.transaction },
			],
		})

		const withdrawalAmount = parseUnits(from.amount, from.token.decimals)
		const { request } = await publicClient.simulateContract({
			account: from.address as Address,
			abi: ParentPoolABI,
			functionName: 'startWithdrawal',
			address: parentPool,
			args: [withdrawalAmount],
		})

		const txHash = await walletClient.writeContract(request)
		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [
				{ title: 'Signature required', status: 'success', type: StageType.approve },
				{ title: 'Withdrawal in progress...', status: 'pending', type: StageType.transaction },
			],
		})

		await checkTxStatus(txHash, publicClient, poolDispatch, poolState)
	} catch (error: any) {
		if (error.message.includes('AllowanceError')) {
			console.error('Allowance error:', error)
		} else {
			console.error(error)
			poolDispatch({ type: PoolActionType.SET_SWAP_STAGE, payload: PoolCardStage.failed })
			poolDispatch({
				type: PoolActionType.APPEND_SWAP_STEP,
				payload: {
					title: 'Withdrawal failed',
					body: 'Something went wrong',
					status: 'error',
					type: StageType.transaction,
				},
			})
			trackWithdrawalStatus('FAILED', poolState)
		}
	} finally {
		poolDispatch({ type: PoolActionType.SET_LOADING, payload: false })
	}
}

const checkTxStatus = async (
	txHash: Hash,
	publicClient: any,
	poolDispatch: Dispatch<PoolAction>,
	poolState: PoolState,
) => {
	const receipt = await publicClient.waitForTransactionReceipt({
		hash: txHash,
		timeout: 0,
		confirmations: 2,
	})

	if (receipt.status === 'reverted') {
		poolDispatch({ type: PoolActionType.SET_LOADING, payload: false })
		poolDispatch({
			type: PoolActionType.SET_SWAP_STAGE,
			payload: PoolCardStage.failed,
		})
		poolDispatch({
			type: PoolActionType.APPEND_SWAP_STEP,
			payload: { title: 'Withdrawal failed', body: 'Something went wrong', status: 'error' },
		})

		trackWithdrawalStatus('FAILED', poolState, txHash)
		return
	}

	poolDispatch({ type: PoolActionType.SET_SWAP_STAGE, payload: PoolCardStage.success })
	poolDispatch({
		type: PoolActionType.SET_SWAP_STEPS,
		payload: [
			{ title: 'Signature required', status: 'success', type: StageType.approve },
			{ title: 'Withdrawal in progress...', status: 'success', type: StageType.transaction },
		],
	})

	trackWithdrawalStatus('SUCCESS', poolState, txHash)
}

export const retryWithdrawal = async (poolState: PoolState, client: WalletClient): Promise<TransactionStatus> => {
	const { from } = poolState

	await client.switchChain({ id: chain.id })

	const hash = await client.writeContract({
		account: from.address as Address,
		abi: parseAbi(['function retryPerformWithdrawalRequest() external']),
		functionName: 'retryPerformWithdrawalRequest',
		address: parentPool,
		gas: 4_000_000n,
		chain,
	})

	const receipt = await publicClient.waitForTransactionReceipt({
		hash,
		timeout: 0,
		confirmations: 2,
	})

	if (receipt.status === 'reverted') {
		trackWithdrawalStatus('FAILED', poolState, hash)
		return TransactionStatus.FAILED
	}

	trackWithdrawalStatus('SUCCESS', poolState, hash)
	return TransactionStatus.SUCCESS
}
