import { type Address, type WalletClient, type Hash, decodeEventLog, parseUnits } from 'viem'
import { PoolActionType, PoolCardStage, StageType, type PoolAction, type PoolState } from '../poolReducer/types'
import { type Dispatch } from 'react'
import { config } from '../../../../../constants/config'
import { parentPoolBaseSepolia } from '../../../config/poolTestnetAddresses'
import { parentPoolBase } from '../../../config/poolMainnetAddresses'
import { base, baseSepolia } from 'viem/chains'
import { handleAllowance } from './allowance'
import { getPublicClient, getWalletClient } from '../../../../../web3/wagmi'
import { ParentPoolABI } from '../../../config/abi/ParentPoolABI1_5'
import { trackEvent } from '../../../../../hooks/useTracking'
import { category, action } from '../../../../../constants/tracking'
import { parseAbi } from 'viem'

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
				{ title: 'Withdrawal in progress...', status: 'pending', type: StageType.requestTx },
			],
		})

		const withdrawalAmount = parseUnits(from.amount, from.token.decimals)
		const { request } = await publicClient.simulateContract({
			account: from.address as Address,
			abi: ParentPoolABI,
			functionName: 'startWithdrawal',
			address: parentPool,
			args: [withdrawalAmount],
			gas: 4_000_000n,
		})

		const txHash = await walletClient.writeContract(request)
		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [
				{ title: 'Signature required', status: 'success', type: StageType.approve },
				{ title: 'Withdrawal in progress...', status: 'pending', type: StageType.requestTx },
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
					title: 'Deposit failed',
					body: 'Something went wrong',
					status: 'error',
					type: StageType.requestTx,
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
		timeout: 300_000,
		pollingInterval: 3_000,
		retryCount: 30,
		confirmations: 5,
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

	for (const log of receipt.logs) {
		try {
			const decodedLog = decodeEventLog({
				abi: ParentPoolABI,
				data: log.data,
				topics: log.topics,
				strict: false,
			})

			if (decodedLog.eventName === 'ConceroParentPool_WithdrawRequestInitiated') {
				poolDispatch({ type: PoolActionType.SET_SWAP_STAGE, payload: PoolCardStage.success })
				poolDispatch({
					type: PoolActionType.SET_SWAP_STEPS,
					payload: [
						{ title: 'Signature required', status: 'success', type: StageType.approve },
						{ title: 'Deposit in progress...', status: 'success', type: StageType.requestTx },
					],
				})
				trackEvent({
					category: category.PoolCard,
					action: action.SuccessWithdrawalRequest,
					label: 'action_success_withdraw_request',
					data: { txHash },
				})
				return
			}
		} catch (err) {
			console.error('Error decoding log:', err)
		}
	}
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
		timeout: 60_000,
		pollingInterval: 3_000,
		retryCount: 50,
		confirmations: 5,
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

	for (const log of receipt.logs) {
		try {
			const decodedLog = decodeEventLog({
				abi: ParentPoolABI,
				data: log.data,
				topics: log.topics,
				strict: false,
			})

			if (decodedLog.eventName === 'ConceroAutomation_RetryPerformed') {
				trackEvent({
					category: category.PoolUserActions,
					action: action.SuccessRetryWithdrawalRequest,
					label: action.SuccessRetryWithdrawalRequest,
					data: { txHash: hash },
				})
				return TransactionStatus.SUCCESS
			}
		} catch (err) {
			console.error('Error decoding log:', err)
		}
	}

	trackEvent({
		category: category.PoolUserActions,
		action: action.FailedRetryWithdrawalRequest,
		label: action.FailedRetryWithdrawalRequest,
		data: { txHash: hash },
	})
	return TransactionStatus.FAILED
}
