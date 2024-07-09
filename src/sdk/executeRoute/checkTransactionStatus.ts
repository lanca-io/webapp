import type { PublicClient } from 'viem/clients/createPublicClient'
import { getPublicClient } from '@wagmi/core'
import { config } from '../../web3/wagmi'
import { conceroAddressesMap } from '../../components/cards/SwapCard/swapExecution/executeConceroRoute'
import { decodeEventLog } from 'viem'
import { ExecuteRouteStage, type ExecutionState } from '../types/executeSettingsTypes'
import type { RouteData } from '../types/routeTypes'
import { conceroAbi } from './conceroOrchestratorAbi'

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

export async function checkTransactionStatusOld(
	txHash: string,
	srcPublicClient: PublicClient,
	sendState: (state: ExecutionState) => void,
	routeData: RouteData,
): Promise<number | undefined> {
	const txStart = new Date().getTime()
	const tx = await srcPublicClient.waitForTransactionReceipt({
		hash: txHash as `0x${string}`,
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

	const dstPublicClient = getPublicClient(config, { chainId: Number(routeData.to.chain.id) })

	const latestDstChainBlock = (await dstPublicClient.getBlockNumber()) - 100n
	const latestSrcChainBlock = (await srcPublicClient.getBlockNumber()) - 100n

	const txLog = await getLogByName(
		txHash,
		'CCIPSent',
		conceroAddressesMap[routeData.from.chain.id],
		srcPublicClient,
		'0x' + latestSrcChainBlock.toString(16),
	)

	const ccipMessageId = txLog?.args?.ccipMessageId

	let dstLog = null
	let srcFailLog = null

	console.log('ccipMessageId', ccipMessageId)

	if (ccipMessageId) {
		while (dstLog === null && srcFailLog === null) {
			;[dstLog, srcFailLog] = await Promise.all([
				getLogByName(
					ccipMessageId,
					'UnconfirmedTXAdded',
					conceroAddressesMap[routeData.to.chain.id],
					dstPublicClient,
					'0x' + latestDstChainBlock.toString(16),
				),
				getLogByName(
					ccipMessageId,
					'FunctionsRequestError',
					conceroAddressesMap[routeData.from.chain.id],
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

	let dstLog2 = null
	let dstFailLog = null

	while (dstLog2 === null && dstFailLog === null) {
		;[dstFailLog, dstLog2] = await Promise.all([
			getLogByName(
				ccipMessageId,
				'FunctionsRequestError',
				conceroAddressesMap[routeData.to.chain.id],
				dstPublicClient,
				'0x' + latestDstChainBlock.toString(16),
			),
			getLogByName(
				ccipMessageId,
				'TXReleased',
				conceroAddressesMap[routeData.to.chain.id],
				dstPublicClient,
				'0x' + latestDstChainBlock.toString(16),
			),
		])

		await sleep(3000)
	}

	if (dstFailLog) {
		sendState({
			stage: ExecuteRouteStage.failedTransaction,
			payload: {
				title: 'Tailed transaction',
				body: 'Transaction failed in receiving stage',
				status: 'failed',
				txLink: null,
			},
		})
		return
	}

	sendState({
		stage: ExecuteRouteStage.successTransaction,
		payload: {
			title: 'Swap execute successfully!',
			body: 'Check your balance',
			status: 'success',
			txLink: null,
		},
	})

	return txStart
}
