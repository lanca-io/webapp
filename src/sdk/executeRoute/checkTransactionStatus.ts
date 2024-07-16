import type { PublicClient } from 'viem/clients/createPublicClient'
import { type Address, createPublicClient, decodeEventLog, http, type Log, parseAbiItem, type Transaction } from 'viem'
import { ExecuteRouteStage, type ExecutionState } from '../types/executeSettingsTypes'
import type { RouteData } from '../types/routeTypes'
import { conceroAbi } from './conceroOrchestratorAbi'
import { viemChains } from '../configs/chainsConfig'
import functionsAbi from '../assets/contractsData/conctractFunctionsData.json'
import { conceroAddressesMap } from '../configs/conceroAddressesMap'

type SwapStatusType = 'success' | 'fail'

const throwError = (txHash: string) => {
	const error = new Error('Failed transaction')
	error.data = { txHash }

	throw error
}

const trackSwapTransaction = (logs: Log[], sendState: (state: ExecutionState) => void): SwapStatusType => {
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

				return 'success'
			}
		} catch (err) {}
	}

	throw new Error()
}

const trackBridgeTransaction = async (
	tx: Transaction,
	routeData: RouteData,
	srcPublicClient: PublicClient,
	sendState: (state: ExecutionState) => void,
	conceroAddress: Address,
	clientAddress: Address,
): Promise<SwapStatusType> => {
	const dstPublicClient = createPublicClient({
		chain: viemChains[routeData.to.chain.id].chain,
		transport: viemChains[routeData.to.chain.id].transport ?? http(),
	})

	const latestDstChainBlock = await dstPublicClient.getBlockNumber()

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

	const { ccipMessageId } = logCCIPSent.args
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

				return 'success'
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

				return 'fail'
			}
		})

		if (retryCount === maxRetries) {
			clearInterval(timerId)
		}

		retryCount++
	}, 2000)

	return 'fail'
}

export async function checkTransactionStatus(
	txHash: string,
	srcPublicClient: PublicClient,
	sendState: (state: ExecutionState) => void,
	routeData: RouteData,
	conceroAddress: Address,
	clientAddress: Address,
): Promise<SwapStatusType> {
	sendState({ stage: ExecuteRouteStage.pendingTransaction })

	const tx = await srcPublicClient.waitForTransactionReceipt({
		hash: txHash as `0x${string}`,
		timeout: 300_000,
		pollingInterval: 3_000,
		retryCount: 12,
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

	let swapTxStatus: SwapStatusType = 'fail'

	if (swapType === 'swap') {
		swapTxStatus = trackSwapTransaction(tx.logs, sendState)
	}

	if (swapType === 'bridge') {
		swapTxStatus = await trackBridgeTransaction(
			tx,
			routeData,
			srcPublicClient,
			sendState,
			conceroAddress,
			clientAddress,
		)
	}

	if (swapTxStatus === 'fail') {
		throwError(txHash)
	}
}
