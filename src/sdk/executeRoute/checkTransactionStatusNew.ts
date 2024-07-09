import type { PublicClient } from 'viem/clients/createPublicClient'
import { type Address, createPublicClient, decodeEventLog, parseAbiItem, http } from 'viem'
import { ExecuteRouteStage, type ExecutionState } from '../types/executeSettingsTypes'
import type { RouteData } from '../types/routeTypes'
import { conceroAbi } from './conceroOrchestratorAbi'
import { conceroAddressesMap } from '../configs/conceroAddressesMap'
import { viemChains } from '../configs/chainsConfig'
import functionsAbi from '../assets/contractsData/conctractFunctionsData.json'

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

const trackBridgeTransaction = async (
	tx,
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

	const dstConceroContract = conceroAddressesMap[routeData.to.chain.id]
	const latestDstChainBlock = (await dstPublicClient.getBlockNumber()) - 100n

	const [logCCIPSent] = await srcPublicClient.getLogs({
		address: conceroAddress,
		event: parseAbiItem(
			'event CCIPSent(bytes32 indexed ccipMessageId, address sender, address recipient, uint8 token, uint256 amount, uint64 dstChainSelector)',
		),
		args: {
			from: clientAddress,
			to: clientAddress,
		},
		fromBlock: tx.blockNumber,
		toBlock: 'latest',
	})

	const { ccipMessageId } = logCCIPSent.args
	console.log('CCIPSent', ccipMessageId)

	let fromBlock = latestDstChainBlock - 1000n
	let toBlock = latestDstChainBlock

	while (Number(toBlock) > Number(latestDstChainBlock - 200_000n)) {
		const logs = await dstPublicClient.getLogs({
			address: conceroAddress,
			abi: functionsAbi,
			fromBlock,
			toBlock,
		})

		console.log(logs.length)

		for (const log of logs) {
			try {
				const decodedLog = decodeEventLog({
					abi: functionsAbi,
					data: log.data,
					topics: log.topics,
				})
				console.log('decodedLog', decodedLog, decodedLog.args?.ccipMessageId)
				if (decodedLog.eventName === 'UnconfirmedTXAdded' && decodedLog.args.ccipMessageId === logCCIPSent) {
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
			} catch (err) {
				console.log(err.message)
			}
		}

		fromBlock -= 1000n
		toBlock -= 1000n
	}

	// const getFailureLog = await dstPublicClient.getLogs({
	// 	address: dstConceroContract,
	// 	event: parseAbiItem(
	// 		'event FunctionsRequestError(bytes32 indexed ccipMessageId, bytes32 requestId, uint8 requestType)',
	// 	),
	// 	args: {
	// 		from: clientAddress,
	// 		to: clientAddress,
	// 	},
	// 	fromBlock: latestDstChainBlock - 100n,
	// 	toBlock: 'latest',
	// })
	//
	// if (true) {
	// 	sendState({
	// 		stage: ExecuteRouteStage.failedTransaction,
	// 		payload: {
	// 			title: 'Tailed transaction',
	// 			body: 'Transaction failed in send stage',
	// 			status: 'failed',
	// 			txLink: null,
	// 		},
	// 	})
	// 	return
	// }
	//
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

	console.log('START TRACKING')

	const tx = await srcPublicClient.waitForTransactionReceipt({
		hash: txHash as `0x${string}`,
		// timeout: 120_000,
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

	await trackBridgeTransaction(tx, routeData, srcPublicClient, sendState, conceroAddress, clientAddress)

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
