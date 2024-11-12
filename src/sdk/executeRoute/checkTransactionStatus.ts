import type { PublicClient } from 'viem/clients/createPublicClient'
import { type Address, decodeEventLog, type Log, parseAbi, parseAbiItem, type TransactionReceipt } from 'viem'
import { ExecuteRouteStage, type ExecutionState } from '../types/executeSettingsTypes'
import type { RouteData } from '../types/routeTypes'
import { conceroAbi } from './conceroOrchestratorAbi'
import { getPublicClient } from '../configs/chainsConfig'
import { conceroAddressesMap } from '../configs/conceroAddressesMap'
import { trackEvent } from '../../hooks/useTracking'
import { action, category } from '../../constants/tracking'
import { decodeEventLogWrapper } from '../utils/decodeEventLogWrapper'
import { throwError } from '../utils/throwError'
import { sleep } from '../utils/sleep'

const ConceroBridgeEventsAbi = parseAbi([
	'event TXReleased(bytes32 indexed ccipMessageId, address indexed sender, address indexed recipient, address token, uint256 amount)',
	'event FunctionsRequestError(bytes32 indexed ccipMessageId, bytes32 requestId, uint8 requestType)',
])

const timer = (func: (num: number) => void) => {
	let counterTime = 1

	const timerId = setInterval(() => {
		counterTime++
		func(counterTime)
	}, 1000)

	return () => {
		clearInterval(timerId)
	}
}

const trackSwapTransaction = (logs: Log[]) => {
	for (const log of logs) {
		try {
			const decodedLog = decodeEventLog({
				abi: conceroAbi,
				data: log.data,
				topics: log.topics,
			})

			if (decodedLog.eventName === 'Orchestrator_SwapSuccess') {
				return
			}
		} catch (err) {}
	}
}

const trackBridgeTransaction = async (
	txReceipt: TransactionReceipt,
	routeData: RouteData,
	srcPublicClient: PublicClient,
	sendState: (state: ExecutionState) => void,
	conceroAddress: Address,
	clientAddress: Address,
): Promise<void> => {
	const dstPublicClient = getPublicClient(routeData.to.chain.id)
	const latestDstChainBlock = await dstPublicClient.getBlockNumber()

	// TODO get log to receipt
	const [logCCIPSent] = await srcPublicClient.getLogs({
		address: conceroAddress,
		event: parseAbiItem(
			'event CCIPSent(bytes32 indexed ccipMessageId, address sender, address recipient, uint8 token, uint256 amount, uint64 dstChainSelector)',
		),
		args: {
			from: clientAddress,
			to: clientAddress,
		},
		fromBlock: txReceipt.blockNumber,
		toBlock: 'latest',
	})

	if (!logCCIPSent?.args?.ccipMessageId) {
		await trackBridgeTransaction(txReceipt, routeData, srcPublicClient, sendState, conceroAddress, clientAddress)
		return
	}

	const { ccipMessageId } = logCCIPSent.args

	const stopClFunctionsCheckTimer = timer(time => {
		if (time === 120) {
			sendState({ stage: ExecuteRouteStage.longDurationConfirming, payload: { ccipId: ccipMessageId } })

			trackEvent({
				category: category.SwapCard,
				action: action.ClFunctionsFailed,
				label: 'cl_functions_failed',
				data: { provider: 'concero', route: routeData, txHash: txReceipt.transactionHash },
			})
		}
	})

	const dstConceroAddress = conceroAddressesMap[routeData.to.chain.id]

	let retryCount = 0
	const maxRetries = 120

	while (retryCount < maxRetries) {
		const logs = await dstPublicClient.getLogs({
			address: dstConceroAddress,
			abi: ConceroBridgeEventsAbi,
			fromBlock: latestDstChainBlock,
			toBlock: 'latest',
		})

		for (const log of logs) {
			const decodedLog = decodeEventLogWrapper({
				abi: ConceroBridgeEventsAbi,
				log,
			})

			if (!decodedLog) continue

			const dstCcipMessageId = decodedLog.args?.ccipMessageId as string
			const isCurrentCcipMessage =
				dstCcipMessageId && dstCcipMessageId?.toLowerCase() === ccipMessageId.toLowerCase()

			if (decodedLog.eventName === 'TXReleased' && !isCurrentCcipMessage) {
				console.log('TxReleased with wrong ccip msg', { dstCcipMessageId, ccipMessageId, decodedLog })
			}

			if (!isCurrentCcipMessage) continue

			if (decodedLog.eventName === 'TXReleased') {
				stopClFunctionsCheckTimer()
				return
			}

			if (decodedLog.eventName === 'FunctionsRequestError') {
				sendState({
					stage: ExecuteRouteStage.failedTransaction,
					payload: {
						title: 'Failed transaction',
						body: 'Transaction was reverted',
						status: 'failed',
						txLink: null,
					},
				})

				stopClFunctionsCheckTimer()
				throwError({ txHash: txReceipt.transactionHash })
			}
		}

		retryCount++
		await sleep(2000)
	}
}

export async function checkTransactionStatus(
	txHash: string,
	srcPublicClient: PublicClient,
	sendState: (state: ExecutionState) => void,
	routeData: RouteData,
	conceroAddress: Address,
	clientAddress: Address,
) {
	sendState({ stage: ExecuteRouteStage.pendingTransaction })

	const txReceipt = await srcPublicClient.waitForTransactionReceipt({
		hash: txHash as `0x${string}`,
		pollingInterval: 3_000,
		retryCount: 500,
		confirmations: 3,
	})

	if (txReceipt.status === 'reverted') {
		sendState({
			stage: ExecuteRouteStage.failedTransaction,
			payload: {
				title: 'Tailed transaction',
				body: 'Transaction was reverted',
				status: 'failed',
				txLink: null,
			},
		})

		throwError(txHash)
	}

	const swapType = routeData.from.chain?.id === routeData.to.chain?.id ? 'swap' : 'bridge'

	if (swapType === 'swap') {
		trackSwapTransaction(txReceipt.logs)
	} else {
		await trackBridgeTransaction(txReceipt, routeData, srcPublicClient, sendState, conceroAddress, clientAddress)
	}
}
