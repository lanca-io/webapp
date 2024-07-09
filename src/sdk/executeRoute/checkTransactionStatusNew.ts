import type { PublicClient } from 'viem/clients/createPublicClient'
import { getPublicClient } from '@wagmi/core'
import { config } from '../../web3/wagmi'
import { type Address, decodeEventLog } from 'viem'
import { ExecuteRouteStage, type ExecutionState } from '../types/executeSettingsTypes'
import type { RouteData } from '../types/routeTypes'
import { conceroAbi } from './conceroOrchestratorAbi'
import { conceroAddressesMap } from '../../components/cards/SwapCard/swapExecution/executeConceroRoute'

const sleep = async (ms: number) => await new Promise(resolve => setTimeout(resolve, ms))

const getLogByName = async (
	id: string,
	eventName: string,
	contractAddress: string,
	viemPublicClient: any,
	fromBlock: string,
): Promise<any | null> => {
	const logs = await viemPublicClient.getLogs({
		address: contractAddress,
		abi: conceroAbi,
		fromBlock,
		toBlock: 'latest',
	})

	const filteredLog = logs.find((log: any) => {
		let decodedLog: any = null

		try {
			decodedLog = decodeEventLog({
				abi: conceroAbi,
				data: log.data,
				topics: log.topics,
			})
		} catch (err) {
			return false
		}

		if (decodedLog?.args) {
			const logId = eventName === 'CCIPSent' ? log.transactionHash : decodedLog.args.ccipMessageId
			return logId?.toLowerCase() === id.toLowerCase() && decodedLog.eventName === eventName
		}
		return false
	})

	if (!filteredLog) {
		return null
	}

	return decodeEventLog({
		abi: conceroAbi,
		data: filteredLog.data,
		topics: filteredLog.topics,
	})
}

const trackSwapTransaction = async (logs, sendState) => {
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

			console.log('decodedLog', decodedLog)
		} catch (err) {
			console.log(err)
		}
	}
}

const trackBridgeTransaction = async (tx, routeData, srcPublicClient, sendState, conceroAddress) => {
	const dstPublicClient = getPublicClient(config, { chainId: Number(routeData.to.chain.id) })

	const latestSrcChainBlock = (await srcPublicClient.getBlockNumber()) - 100n
	const latestDstChainBlock = (await dstPublicClient.getBlockNumber()) - 100n

	for (const log of tx.logs) {
		try {
			const decodedLog = decodeEventLog({
				abi: conceroAbi,
				data: log.data,
				topics: log.topics,
			})
			console.log(decodedLog)

			console.log('decodedLog', decodedLog)
		} catch (err) {
			console.log(err)
		}
	}

	const txLogCcipSent = await getLogByName(
		tx.hash,
		'CCIPSent',
		conceroAddress,
		srcPublicClient,
		'0x' + latestSrcChainBlock.toString(16),
	)

	console.log('CCIPSent', txLogCcipSent)

	const ccipMessageId = txLogCcipSent?.args?.ccipMessageId

	let dstLog = null
	let srcFailLog = null

	if (ccipMessageId) {
		while (dstLog === null && srcFailLog === null) {
			;[dstLog, srcFailLog] = await Promise.all([
				getLogByName(
					ccipMessageId,
					'UnconfirmedTXAdded',
					conceroAddress,
					dstPublicClient,
					'0x' + latestDstChainBlock.toString(16),
				),
				getLogByName(
					ccipMessageId,
					'FunctionsRequestError',
					conceroAddress,
					srcPublicClient,
					'0x' + latestSrcChainBlock.toString(16),
				),
			])

			await sleep(3000)
		}
	}

	if (srcFailLog) {
		sendState({
			stage: ExecuteRouteStage.failedTransaction,
			payload: {
				title: 'Tailed transaction',
				body: 'Transaction failed in send stage',
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
}

export async function checkTransactionStatus(
	txHash: string,
	srcPublicClient: PublicClient,
	sendState: (state: ExecutionState) => void,
	routeData: RouteData,
	conceroAddress: Address,
): Promise<number | undefined> {
	const txStart = new Date().getTime()
	const tx = await srcPublicClient.waitForTransactionReceipt({
		hash: txHash as `0x${string}`,
	})
	console.log(tx)

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

	console.log(swapType)

	if (swapType === 'swap') {
		await trackSwapTransaction(tx.logs, sendState)
		return
	}

	await trackBridgeTransaction(tx, routeData, srcPublicClient, sendState, conceroAddress)

	// sendState({
	// 	stage: ExecuteRouteStage.failedTransaction,
	// 	payload: {
	// 		title: 'Tailed transaction',
	// 		body: 'Transaction failed in send stage',
	// 		status: 'failed',
	// 		txLink: null,
	// 	},
	// })
	//

	//
	// sendState({
	// 	stage: ExecuteRouteStage.successTransaction,
	// 	payload: {
	// 		title: 'Swap execute successfully!',
	// 		body: 'Check your balance',
	// 		status: 'success',
	// 		txLink: null,
	// 	},
	// })

	return txStart
}
