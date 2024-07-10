import type { PublicClient } from 'viem/clients/createPublicClient'
import { type Address, createPublicClient, decodeEventLog, parseAbiItem, http, type Transaction, type Log } from 'viem'
import { ExecuteRouteStage, type ExecutionState } from '../types/executeSettingsTypes'
import type { RouteData } from '../types/routeTypes'
import { conceroAbi } from './conceroOrchestratorAbi'
import { viemChains } from '../configs/chainsConfig'
import functionsAbi from '../assets/contractsData/conctractFunctionsData.json'

const trackSwapTransaction = async (logs: Log[], sendState: (state: ExecutionState) => void) => {
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
		} catch (err) {
			console.log(err)
		}
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
		transport: http(),
	})

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

	const timerId = setInterval(async () => {
		const latestDstChainBlock = await dstPublicClient.getBlockNumber()

		const logs = await dstPublicClient.getLogs({
			address: conceroAddress,
			abi: functionsAbi,
			fromBlock: latestDstChainBlock - 500n,
			toBlock: 'latest',
		})

		const maxRetries = 120
		let retryCount = 0

		logs.forEach(log => {
			const decodedLog = decodeEventLog({
				abi: functionsAbi,
				data: log.data,
				topics: log.topics,
			})

			const dstCcipMessageId = decodedLog.args?.ccipMessageId as string
			const isCurrentCcipMessage = dstCcipMessageId === ccipMessageId

			console.log({
				event: decodedLog,
				eventName: decodedLog.eventName,
				isCurrentCcipMessage,
				dstCcipMessageId,
				srcCcipMessageId: ccipMessageId,
				latestDstChainBlock: log.blockNumber,
				txHash: log.transactionHash,
			})

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
			}
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
			}
		})

		if (retryCount === maxRetries) {
			clearInterval(timerId)
		}

		retryCount++
	}, 1000)
}

export async function checkTransactionStatus(
	txHash: string,
	srcPublicClient: PublicClient,
	sendState: (state: ExecutionState) => void,
	routeData: RouteData,
	conceroAddress: Address,
	clientAddress: Address,
): Promise<number | undefined> {
	const txStart = new Date().getTime()

	const tx = await srcPublicClient.waitForTransactionReceipt({
		hash: txHash as `0x${string}`,
		timeout: 60_000,
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
		return
	}

	sendState({
		stage: ExecuteRouteStage.confirmingTransaction,
		payload: {
			title: 'Transaction confirming',
			body: 'Checking transaction confirmation',
			status: 'await',
			txLink: null,
		},
	})

	const swapType = routeData.from.chain?.id === routeData.to.chain?.id ? 'swap' : 'bridge'

	if (swapType === 'swap') {
		await trackSwapTransaction(tx.logs, sendState)
		return
	}

	await trackBridgeTransaction(tx, routeData, srcPublicClient, sendState, conceroAddress, clientAddress)
}
