import { type Address, type WalletClient, type Hash, decodeEventLog } from 'viem'
import { PoolActionType, PoolCardStage, type PoolAction, type PoolState } from '../poolReducer/types'
import { type Dispatch } from 'react'
import { config } from '../../../../../constants/config'
import { parentPoolBaseSepolia } from '../../../config/poolTestnetAddresses'
import { parentPoolBase } from '../../../config/poolMainnetAddresses'
import { base, baseSepolia } from 'viem/chains'
import { handleAllowance } from './allowance'
import { getPublicClient, getWalletClient } from '../../../../../web3/wagmi'
import { ParentPoolABI } from '../../../config/abi/ParentPoolABI1_5'
import { addingAmountDecimals } from '../../../../../utils/formatting'
import { trackEvent } from '../../../../../hooks/useTracking'
import { category, action } from '../../../../../constants/tracking'
import { parseAbi } from 'viem'

enum TransactionStatus {
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

	if (to.amount === '' || to.amount === '0') return

	poolDispatch({ type: PoolActionType.SET_LOADING, payload: true })
	poolDispatch({ type: PoolActionType.SET_SWAP_STAGE, payload: PoolCardStage.progress })
	poolDispatch({
		type: PoolActionType.SET_SWAP_STEPS,
		payload: [
			{
				title: 'Action required',
				body: 'Please approve the transaction in your wallet',
				status: 'await',
				txLink: null,
			},
		],
	})

	try {
		await walletClient.switchChain({ id: chain.id })
		await handleAllowance(poolState, poolDispatch, publicClient, walletClient)

		const depositAmount = addingAmountDecimals(from.amount, from.token.decimals)
		if (!depositAmount) throw new Error('Invalid deposit amount')

		const { request } = await publicClient.simulateContract({
			account: from.address as Address,
			abi: ParentPoolABI,
			functionName: 'startWithdrawal',
			address: parentPool,
			args: [BigInt(depositAmount)],
			gas: 4_000_000n,
		})

		const txHash = await walletClient.writeContract(request)
		await checkTxStatus(txHash, publicClient, poolDispatch)
	} catch (error) {
		console.error(error)
		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [{ title: 'Transaction failed', body: 'Something went wrong', status: 'error' }],
		})
		poolDispatch({ type: PoolActionType.SET_SWAP_STAGE, payload: PoolCardStage.failed })
	} finally {
		poolDispatch({ type: PoolActionType.SET_LOADING, payload: false })
	}
}

const checkTxStatus = async (txHash: Hash, publicClient: any, swapDispatch: Dispatch<PoolAction>) => {
	const receipt = await publicClient.waitForTransactionReceipt({
		hash: txHash,
		timeout: 300_000,
		pollingInterval: 3_000,
		retryCount: 30,
		confirmations: 5,
	})

	if (receipt.status === 'reverted') {
		swapDispatch({
			type: PoolActionType.SET_SWAP_STAGE,
			payload: PoolCardStage.failed,
		})
		swapDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [{ title: 'Transaction failed', body: 'Something went wrong', status: 'error' }],
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
				swapDispatch({
					type: PoolActionType.SET_SWAP_STAGE,
					payload: PoolCardStage.success,
				})
				swapDispatch({
					type: PoolActionType.SET_SWAP_STEPS,
					payload: [{ status: 'success', title: 'Sending transaction' }],
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
