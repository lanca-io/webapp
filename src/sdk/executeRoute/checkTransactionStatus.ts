import type { PublicClient } from 'viem/clients/createPublicClient'
import { type Address, parseAbi, parseAbiItem, type TransactionReceipt } from 'viem'
import { ExecuteRouteStage, type ExecutionState } from '../types/executeSettingsTypes'
import type { RouteData } from '../types/routeTypes'
import { getPublicClient } from '../configs/chainsConfig'
import { conceroAddressesMap } from '../configs/conceroAddressesMap'
import { trackEvent } from '../../hooks/useTracking'
import { action, category } from '../../constants/tracking'
import { decodeEventLogWrapper } from '../utils/decodeEventLogWrapper'
import { throwError } from '../utils/throwError'
import { sleep } from '../utils/sleep'

const ConceroBridgeEventsAbi = parseAbi([
	'event TXReleased(bytes32 indexed conceroMessageId, address indexed recipient, address token, uint256 amount)',
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
			'event ConceroBridgeSent(bytes32 indexed conceroMessageId, uint256 amount, uint64 dstChainSelector, address receiver, bytes compressedDstSwapData)',
		),
		args: {
			from: clientAddress,
			to: clientAddress,
		},
		fromBlock: txReceipt.blockNumber,
		toBlock: 'latest',
	})

	if (!logCCIPSent?.args?.conceroMessageId) {
		await trackBridgeTransaction(txReceipt, routeData, srcPublicClient, sendState, conceroAddress, clientAddress)
		return
	}

	const { conceroMessageId } = logCCIPSent.args

	const stopClFunctionsCheckTimer = timer(time => {
		if (time === 120) {
			sendState({ stage: ExecuteRouteStage.longDurationConfirming, payload: { ccipId: conceroMessageId } })

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

			const dstCcipMessageId = decodedLog.args?.conceroMessageId
			const isCurrentCcipMessage =
				dstCcipMessageId && dstCcipMessageId?.toLowerCase() === conceroMessageId.toLowerCase()

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

	const swapType = routeData.from.chain?.id === routeData.to.chain?.id ? 'swap' : 'bridge'

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
	} else if (swapType === 'swap' && txReceipt.status === 'success') {
		return
	}

	if (swapType === 'bridge') {
		await trackBridgeTransaction(txReceipt, routeData, srcPublicClient, sendState, conceroAddress, clientAddress)
	}
}
