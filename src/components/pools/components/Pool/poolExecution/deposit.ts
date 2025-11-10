import { type Address, decodeEventLog, type Hash, type Log, parseUnits, type WalletClient } from 'viem'
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

const trackDepositStatus = (status: 'SUCCESS' | 'FAILED', poolState: PoolState, txHash?: Hash) => {
	const { from } = poolState

	trackEvent({
		category: category.PoolCard,
		action: 'deposit_status',
		label: 'Deposit Status',
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

export async function handleDeposit(
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
				{ title: 'Deposit in progress...', status: 'pending', type: StageType.requestTx },
			],
		})

		const depositAmount = parseUnits(from.amount, from.token.decimals)

		const txHash = await walletClient.writeContract({
			account: from.address as Address,
			abi: ParentPoolABI,
			functionName: 'startDeposit',
			address: parentPool,
			args: [depositAmount],
			chain,
		})

		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [
				{ title: 'Approval required', status: 'success', type: StageType.approve },
				{ title: 'Deposit in progress...', status: 'pending', type: StageType.requestTx },
			],
		})

		await checkStartDepositStatus(txHash, publicClient, walletClient, poolDispatch, poolState)
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
			trackDepositStatus('FAILED', poolState)
		}
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
			payload: {
				title: 'Deposit failed',
				body: 'Start deposit failed',
				status: 'error',
				type: StageType.requestTx,
			},
		})

		trackDepositStatus('FAILED', poolState, txHash)
		return
	}

	poolDispatch({
		type: PoolActionType.SET_SWAP_STEPS,
		payload: [
			{ title: 'Signature required', status: 'success', type: StageType.approve },
			{ title: 'Deposit in progress...', status: 'success', type: StageType.requestTx },
			{ title: 'Deposit in progress...', status: 'pending', type: StageType.transaction },
		],
	})

	const depositInitiatedLog = receipt.logs.find((log: Log) => {
		try {
			if (!log.topics.length) return false

			const decodedLog = decodeEventLog({
				abi: ParentPoolABI,
				data: log.data,
				topics: log.topics,
				strict: false,
			})

			return decodedLog.eventName === 'DepositInitiated'
		} catch (error) {
			return false
		}
	})

	if (!depositInitiatedLog) {
		poolDispatch({ type: PoolActionType.SET_LOADING, payload: false })
		poolDispatch({
			type: PoolActionType.SET_SWAP_STAGE,
			payload: PoolCardStage.failed,
		})
		poolDispatch({
			type: PoolActionType.APPEND_SWAP_STEP,
			payload: {
				title: 'Deposit failed',
				body: 'Could not obtain logs',
				status: 'error',
				type: StageType.requestTx,
			},
		})

		trackDepositStatus('FAILED', poolState, txHash)
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
	const { from, stage } = poolState

	if (stage === PoolCardStage.failed) return

	try {
		const txHash = await walletClient.writeContract({
			account: from.address as Address,
			abi: ParentPoolABI,
			functionName: 'completeDeposit',
			address: parentPool,
			args: [depositRequestId],
			chain,
		})
		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [
				{ title: 'Signature required', status: 'success', type: StageType.approve },
				{ title: 'Deposit in progress...', status: 'success', type: StageType.requestTx },
				{ title: 'Deposit in progress...', status: 'pending', type: StageType.transactionSigned },
				{ title: 'Deposit in progress...', status: 'pending', type: StageType.transaction },
			],
		})

		const receipt = await publicClient.waitForTransactionReceipt({
			hash: txHash,
			timeout: 0,
			confirmations: 2,
		})

		if (receipt.status === 'reverted') {
			poolDispatch({ type: PoolActionType.SET_LOADING, payload: true })
			poolDispatch({
				type: PoolActionType.SET_SWAP_STAGE,
				payload: PoolCardStage.failed,
			})
			poolDispatch({
				type: PoolActionType.APPEND_SWAP_STEP,
				payload: {
					title: 'Deposit failed',
					body: 'Something went wrong',
					status: 'error',
					type: StageType.transaction,
				},
			})

			trackDepositStatus('FAILED', poolState, txHash)
			return
		}

		poolDispatch({ type: PoolActionType.SET_SWAP_STAGE, payload: PoolCardStage.success })
		poolDispatch({
			type: PoolActionType.SET_SWAP_STEPS,
			payload: [
				{ title: 'Signature required', status: 'success', type: StageType.approve },
				{ title: 'Deposit in progress...', status: 'success', type: StageType.requestTx },
				{ title: 'Deposit in progress...', status: 'success', type: StageType.transactionSigned },
				{ title: 'Deposit in progress...', status: 'success', type: StageType.transaction },
			],
		})

		trackDepositStatus('SUCCESS', poolState, txHash)
	} catch (error) {
		console.error('Error during completeDeposit:', error)
		poolDispatch({ type: PoolActionType.SET_LOADING, payload: false })
		poolDispatch({
			type: PoolActionType.SET_SWAP_STAGE,
			payload: PoolCardStage.failed,
		})
		poolDispatch({
			type: PoolActionType.APPEND_SWAP_STEP,
			payload: {
				title: 'Deposit failed',
				body: 'Something went wrong',
				status: 'error',
				type: StageType.transaction,
			},
		})

		trackDepositStatus('FAILED', poolState)
	}
}
