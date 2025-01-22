import { type Address, type Hash, parseAbi, parseUnits, type WalletClient } from 'viem'
import { type PoolAction, PoolActionType, PoolCardStage, type PoolState, StageType } from '../poolReducer/types'
import { type Dispatch } from 'react'
import { config } from '../../../../../constants/config'
import { parentPoolBaseSepolia } from '../../../config/poolTestnetAddresses'
import { parentPoolBase } from '../../../config/poolMainnetAddresses'
import { base, baseSepolia } from 'viem/chains'
import { handleAllowance } from './allowance'
import { getPublicClient, getWalletClient } from '../../../../../web3/wagmi'
import { ParentPoolABI } from '../../../config/abi/ParentPoolABI1_5'
import { trackEvent } from '../../../../../hooks/useTracking'
import { action, category } from '../../../../../constants/tracking'

export enum TransactionStatus {
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
	PENDING = 'PENDING',
	IDLE = 'IDLE',
}

const parentPool = config.IS_TESTNET ? parentPoolBaseSepolia : parentPoolBase
const chain = config.IS_TESTNET ? baseSepolia : base
const publicClient = getPublicClient(chain.id)

export async function handleWithdrawal(
	poolState: PoolState,
	poolDispatch: Dispatch<PoolAction>,
	walletClient: WalletClient,
) {
	const { to, from } = poolState

	trackEvent({
		category: category.PoolCard,
		action: action.BeginWithdrawalRequest,
		label: 'concero_begin_withdrawal',
		data: { from, to },
	})

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

		await checkTxStatus(txHash, publicClient, poolDispatch)
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
		}
	} finally {
		poolDispatch({ type: PoolActionType.SET_LOADING, payload: false })
	}
}

const checkTxStatus = async (txHash: Hash, publicClient: any, poolDispatch: Dispatch<PoolAction>) => {
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

		trackEvent({
			category: category.PoolCard,
			action: action.FailedWithdrawalRequest,
			label: action.FailedWithdrawalRequest,
			data: { txHash },
		})
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

	trackEvent({
		category: category.PoolCard,
		action: action.SuccessWithdrawalRequest,
		label: 'action_success_withdraw_request',
		data: { txHash },
	})
}

export const retryWithdrawal = async (address: Address, chainId: number): Promise<TransactionStatus> => {
	const walletClient = await getWalletClient(chainId)
	await walletClient.switchChain({ id: chain.id })

	const hash = await walletClient.writeContract({
		account: address,
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
		trackEvent({
			category: category.PoolUserActions,
			action: action.FailedRetryWithdrawalRequest,
			label: action.FailedRetryWithdrawalRequest,
			data: { txHash: hash },
		})
		return TransactionStatus.FAILED
	}

	trackEvent({
		category: category.PoolUserActions,
		action: action.SuccessRetryWithdrawalRequest,
		label: action.SuccessRetryWithdrawalRequest,
		data: { txHash: hash },
	})

	return TransactionStatus.SUCCESS
}
