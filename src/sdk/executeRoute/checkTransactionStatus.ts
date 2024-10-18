import type { PublicClient } from 'viem/clients/createPublicClient'
import { type Address, createPublicClient, decodeEventLog, http, type Log, parseAbiItem, type Transaction } from 'viem'
import { ExecuteRouteStage, type ExecutionState } from '../types/executeSettingsTypes'
import type { RouteData } from '../types/routeTypes'
import { conceroAbi } from './conceroOrchestratorAbi'
import { viemChains } from '../configs/chainsConfig'
import functionsAbi from '../assets/contractsData/conctractFunctionsData.json'
import { conceroAddressesMap } from '../configs/conceroAddressesMap'
import { trackEvent } from '../../hooks/useTracking'
import { action, category } from '../../constants/tracking'

const throwError = (txHash: Address) => {
	const error = new Error('Failed transaction')
	error.data = { txHash }

	throw error
}

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

const trackSwapTransaction = (logs: Log[], sendState: (state: ExecutionState) => void) => {
	for (const log of logs) {
		try {
			const decodedLog = decodeEventLog({
				abi: conceroAbi,
				data: log.data,
				topics: log.topics,
			})

			if (decodedLog.eventName === 'Orchestrator_SwapSuccess') {
				sendState({
					stage: ExecuteRouteStage.successTransaction,
					payload: {
						title: 'Swap execute successfully!',
						body: 'Check your balance',
						status: 'success',
						txLink: null,
					},
				})
			}
		} catch (err) {}
	}
}

const trackBridgeTransaction = async (
	tx: Transaction,
	routeData: RouteData,
	srcPublicClient: PublicClient,
	sendState: (state: ExecutionState) => void,
	conceroAddress: Address,
	clientAddress: Address,
) => {
	const dstPublicClient = createPublicClient({
		chain: viemChains[routeData.to.chain.id].chain,
		transport: viemChains[routeData.to.chain.id].transport ?? http(),
	})

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
		fromBlock: tx.blockNumber!,
		toBlock: 'latest',
	})

	if (!logCCIPSent.args) {
		return trackBridgeTransaction(tx, routeData, srcPublicClient, sendState, conceroAddress, clientAddress)
	}

	const { ccipMessageId } = logCCIPSent.args

	const stopTimer = timer(time => {
		if (time === 180) {
			sendState({ stage: ExecuteRouteStage.longDurationConfirming, payload: { ccipId: ccipMessageId } })

			trackEvent({
				category: category.SwapCard,
				action: action.ClFunctionsFailed,
				label: 'cl_functions_failed',
				data: { provider: 'concero', route: routeData, txHash: tx.hash },
			})
		}
	})

	const dstConceroAddress = conceroAddressesMap[routeData.to.chain.id]

	let retryCount = 0
	const maxRetries = 120

	const timerId = setInterval(async () => {
		const logs = await dstPublicClient.getLogs({
			address: dstConceroAddress,
			abi: functionsAbi,
			fromBlock: latestDstChainBlock,
			toBlock: 'latest',
		})

		logs.forEach(log => {
			const decodedLog = decodeEventLog({
				abi: functionsAbi,
				data: log.data,
				topics: log.topics,
			})

			const dstCcipMessageId = decodedLog.args?.ccipMessageId as string
			const isCurrentCcipMessage = dstCcipMessageId === ccipMessageId

			if (ccipMessageId && decodedLog.eventName === 'TXReleased' && isCurrentCcipMessage) {
				sendState({
					stage: ExecuteRouteStage.successTransaction,
					payload: {
						title: 'Swap execute successfully!',
						body: 'Check your balance',
						status: 'success',
						txLink: null,
					},
				})
				clearTimeout(timerId)
				stopTimer()
				return
			}

			if (ccipMessageId && decodedLog.eventName === 'FunctionsRequestError' && isCurrentCcipMessage) {
				sendState({
					stage: ExecuteRouteStage.failedTransaction,
					payload: {
						title: 'Failed transaction',
						body: 'Transaction was reverted',
						status: 'failed',
						txLink: null,
					},
				})
				clearTimeout(timerId)
				stopTimer()
				throwError(tx)
			}
		})

		if (retryCount === maxRetries) {
			stopTimer()
			clearInterval(timerId)
		}

		retryCount++
	}, 2000)
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

	const tx = await srcPublicClient.waitForTransactionReceipt({
		hash: txHash as `0x${string}`,
		pollingInterval: 3_000,
		retryCount: 500,
		confirmations: 3,
	})

	if (tx.status === 'reverted') {
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
		trackSwapTransaction(tx.logs, sendState)
		return
	}

	await trackBridgeTransaction(tx, routeData, srcPublicClient, sendState, conceroAddress, clientAddress)
}
