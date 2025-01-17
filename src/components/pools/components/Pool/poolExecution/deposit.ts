import { type Address, type WalletClient, type Hash, decodeEventLog, parseUnits, type Log } from 'viem'
import { PoolActionType, PoolCardStage, StageType, type PoolAction, type PoolState } from '../poolReducer/types'
import { type Dispatch } from 'react'
import { config } from '../../../../../constants/config'
import { parentPoolBaseSepolia } from '../../../config/poolTestnetAddresses'
import { parentPoolBase } from '../../../config/poolMainnetAddresses'
import { base, baseSepolia } from 'viem/chains'
import { handleAllowance } from './allowance'
import { getPublicClient } from '../../../../../web3/wagmi'
import { ParentPoolABI } from '../../../config/abi/ParentPoolABI1_5'
import { trackEvent } from '../../../../../hooks/useTracking'
import { category, action } from '../../../../../constants/tracking'
import { sleep } from '../../../../../utils/sleep'

interface DepositInitiatedArgs {
	requestId: string
	liquidityProvider: string
	_amount: string
	deadline: string
}

const parentPool = config.IS_TESTNET ? parentPoolBaseSepolia : parentPoolBase
const chain = config.IS_TESTNET ? baseSepolia : base
const publicClient = getPublicClient(chain.id)

export async function handleDeposit(
	poolState: PoolState,
	poolDispatch: Dispatch<PoolAction>,
	walletClient: WalletClient,
) {
	const { to, from } = poolState

	trackEvent({
		category: category.PoolCard,
		action: action.BeginDeposit,
		label: 'concero_begin_deposit',
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
				{ title: 'Transaction confirmation', status: 'await', type: StageType.requestTx },
			],
		})

		const depositAmount = parseUnits(from.amount, from.token.decimals)
		const { request } = await publicClient.simulateContract({
			account: from.address as Address,
			abi: ParentPoolABI,
			functionName: 'startDeposit',
			address: parentPool,
			args: [depositAmount],
			gas: 2_000_000n,
		})

		const txHash = await walletClient.writeContract(request)
		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [
				{ title: 'Signature required', status: 'success', type: StageType.approve },
				{ title: 'Start deposit Confirmation', status: 'pending', type: StageType.requestTx },
			],
		})

		await checkStartDepositStatus(txHash, publicClient, walletClient, poolDispatch, poolState)
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

const checkStartDepositStatus = async (
	txHash: Hash,
	publicClient: any,
	walletClient: WalletClient,
	poolDispatch: Dispatch<PoolAction>,
	poolState: PoolState,
) => {
	const receipt = await publicClient.waitForTransactionReceipt({
		hash: txHash,
		timeout: 300_000,
		pollingInterval: 3_000,
		retryCount: 30,
		confirmations: 5,
	})

	if (receipt.status === 'reverted') {
		poolDispatch({
			type: PoolActionType.SET_SWAP_STAGE,
			payload: PoolCardStage.failed,
		})
		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [{ title: 'Transaction failed', body: 'Start deposit failed', status: 'error' }],
		})

		trackEvent({
			category: category.PoolCard,
			action: action.FailedDeposit,
			label: action.FailedDeposit,
			data: { txHash },
		})
		return
	}

	poolDispatch({
		type: PoolActionType.SET_SWAP_STEPS,
		payload: [
			{ title: 'Signature required', status: 'success', type: StageType.approve },
			{ title: 'Start deposit confirmation', status: 'success', type: StageType.requestTx },
			{ title: 'Complete deposit confirmation', status: 'await', type: StageType.transaction },
		],
	})

	const depositInitiatedLog = receipt.logs.find((log: Log) => {
		try {
			if (!log.topics.length) return false

			const decodedLog = decodeEventLog({
				abi: ParentPoolABI,
				data: log.data,
				topics: log.topics,
			})

			return decodedLog.eventName === 'ConceroParentPool_DepositInitiated'
		} catch (error) {
			return false
		}
	})

	if (!depositInitiatedLog) {
		poolDispatch({
			type: PoolActionType.SET_SWAP_STAGE,
			payload: PoolCardStage.failed,
		})
		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [{ title: 'Transaction failed', body: 'Could not obtain logs', status: 'error' }],
		})

		trackEvent({
			category: category.PoolCard,
			action: action.FailedDeposit,
			label: action.FailedDeposit,
			data: { txHash },
		})
		return
	}

	const decodedLog = decodeEventLog({
		abi: ParentPoolABI,
		data: depositInitiatedLog.data,
		topics: depositInitiatedLog.topics,
	}) as unknown as { args: DepositInitiatedArgs }

	const depositRequestId = decodedLog.args?.requestId
	await sleep(25_000)

	await completeDeposit(poolState, poolDispatch, depositRequestId, walletClient, publicClient)
}

const completeDeposit = async (
	poolState: PoolState,
	poolDispatch: Dispatch<PoolAction>,
	depositRequestId: string,
	walletClient: WalletClient,
	publicClient: any,
) => {
	const { from, to, stage } = poolState

	if (stage === PoolCardStage.failed) return

	const { request } = await publicClient.simulateContract({
		abi: ParentPoolABI,
		functionName: 'completeDeposit',
		address: parentPool,
		args: [depositRequestId],
		gas: 4_000_000n,
	})

	const txHash = await walletClient.writeContract(request)
	poolDispatch({
		type: PoolActionType.SET_SWAP_STEPS,
		payload: [
			{ title: 'Signature required', status: 'success', type: StageType.approve },
			{ title: 'Start deposit confirmation', status: 'success', type: StageType.requestTx },
			{ title: 'Complete deposit confirmation', status: 'pending', type: StageType.transaction },
		],
	})

	const receipt = await publicClient.waitForTransactionReceipt({
		hash: txHash,
		timeout: 300_000,
		pollingInterval: 3_000,
		retryCount: 30,
		confirmations: 5,
	})

	if (receipt.status === 'reverted') {
		poolDispatch({
			type: PoolActionType.SET_SWAP_STAGE,
			payload: PoolCardStage.failed,
		})
		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [{ title: 'Transaction failed', body: 'Something went wrong', status: 'error' }],
		})

		trackEvent({
			category: category.PoolCard,
			action: action.FailedDeposit,
			label: action.FailedDeposit,
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
			})

			if (decodedLog.eventName === 'ConceroParentPool_DepositCompleted') {
				poolDispatch({ type: PoolActionType.SET_SWAP_STAGE, payload: PoolCardStage.success })
				poolDispatch({
					type: PoolActionType.SET_SWAP_STEPS,
					payload: [
						{ title: 'Signature required', status: 'success', type: StageType.approve },
						{ title: 'Start deposit confirmation', status: 'success', type: StageType.requestTx },
						{ title: 'Complete deposit confirmation', status: 'success', type: StageType.transaction },
					],
				})

				trackEvent({
					category: category.PoolCard,
					action: action.SuccessDeposit,
					label: action.SuccessDeposit,
					data: { from, to, txHash },
				})
				return
			}
		} catch (err) {
			console.error('Error decoding log:', err)
		}
	}
}
