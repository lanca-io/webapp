import { useCallback, useEffect, useState } from 'react'
import { useFormStore } from '../../store/form/useFormStore'
import { useTxExecutionStore } from '../../store/tx-execution/useTxExecutionStore'
import { getPublicClient } from '../../configuration/chains'
import { Hash, PublicClient } from 'viem'

const BRIDGE_ESTIMATE = '~15'
const SWAP_ESTIMATE = '~10'

export const useLoadTxExecutionTime = () => {
	const { fromChain, toChain } = useFormStore()
	const { srcHash, dstHash, setExecutionTime } = useTxExecutionStore()
	const [isLoading, setIsLoading] = useState(false)

	const isSwap = !!srcHash && !dstHash

	const fetchSourceTransaction = async (client: PublicClient) => {
		try {
			const tx = await client.getTransaction({ hash: srcHash as Hash })
			if (!tx?.blockNumber) throw new Error('Missing source block number')
			return tx
		} catch {
			return null
		}
	}

	const fetchDestinationTransaction = async (client: PublicClient) => {
		try {
			const tx = await client.getTransaction({ hash: dstHash as Hash })
			if (!tx?.blockNumber) throw new Error('Missing destination block number')
			return tx
		} catch {
			return null
		}
	}

	const fetchBlockTimestamp = async (client: PublicClient, blockNumber: bigint) => {
		try {
			const block = await client.getBlock({ blockNumber })
			if (!block?.timestamp) throw new Error('Missing block timestamp')
			return block.timestamp
		} catch {
			return null
		}
	}

	const calculateExecutionTime = (srcTimestamp: bigint, dstTimestamp?: bigint) => {
		const now = Math.floor(Date.now() / 1000)
		return !dstTimestamp ? now - Number(srcTimestamp) : Number(dstTimestamp) - Number(srcTimestamp)
	}

	const handleEstimation = useCallback(async () => {
		if (!srcHash || !fromChain?.id) {
			return
		}

		setIsLoading(true)

		try {
			const srcClient = getPublicClient(Number(fromChain.id))
			// @ts-ignore
			const srcTx = await fetchSourceTransaction(srcClient)
			if (!srcTx) {
				setExecutionTime(isSwap ? SWAP_ESTIMATE : BRIDGE_ESTIMATE)
				return
			}

			// @ts-ignore
			const srcTimestamp = await fetchBlockTimestamp(srcClient, srcTx.blockNumber)
			if (!srcTimestamp) {
				setExecutionTime(isSwap ? SWAP_ESTIMATE : BRIDGE_ESTIMATE)
				return
			}

			if (isSwap) {
				const swapTime = calculateExecutionTime(srcTimestamp)
				setExecutionTime(swapTime.toString())
				return
			}

			if (!dstHash || !toChain?.id) {
				setExecutionTime(BRIDGE_ESTIMATE)
				return
			}

			const dstClient = getPublicClient(Number(toChain.id))
			// @ts-ignore
			const dstTx = await fetchDestinationTransaction(dstClient)
			if (!dstTx) {
				setExecutionTime(BRIDGE_ESTIMATE)
				return
			}

			// @ts-ignore
			const dstTimestamp = await fetchBlockTimestamp(dstClient, dstTx.blockNumber)
			if (!dstTimestamp) {
				setExecutionTime(BRIDGE_ESTIMATE)
				return
			}

			const bridgeTime = calculateExecutionTime(srcTimestamp, dstTimestamp)
			setExecutionTime(bridgeTime.toString())
		} catch {
			setExecutionTime(isSwap ? SWAP_ESTIMATE : BRIDGE_ESTIMATE)
		} finally {
			setIsLoading(false)
		}
	}, [srcHash, dstHash, fromChain?.id, toChain?.id, isSwap, setExecutionTime])

	useEffect(() => {
		handleEstimation()
	}, [handleEstimation])

	return {
		estimateTime: handleEstimation,
		isLoading,
	}
}
