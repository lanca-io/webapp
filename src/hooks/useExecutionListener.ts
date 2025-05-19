import type { Hash } from 'viem'
import type { IRouteType, ITxStep } from '@lanca/sdk'
import { Status } from '@lanca/sdk'
import { useTxExecutionStore } from '../store/tx-execution/useTxExecutionStore'
import { useCallback } from 'react'

type ExtendedTxStep = ITxStep & {
	srcTxHash: Hash
	dstTxHash: Hash
	txHash?: Hash
}

function hasHashes(execution: Partial<ITxStep> | undefined): execution is Partial<ExtendedTxStep> {
	return !!execution && (('srcTxHash' in execution && 'dstTxHash' in execution) || 'txHash' in execution)
}

export const useExecutionListener = () => {
	const { setSrcHash, setDstHash, setStepStatus } = useTxExecutionStore()

	return useCallback(
		(state: IRouteType) => {
			if (!state?.steps?.length) return
			state.steps.forEach(step => {
				if (step.execution && step.execution.status) {
					setStepStatus(step.type, step.execution.status)
					console.log(step)
					if (step.execution.status === Status.SUCCESS && hasHashes(step.execution)) {
						if (step.execution.txHash) {
							setSrcHash(step.execution.txHash)
						}
						if (step.execution.srcTxHash && step.execution.dstTxHash) {
							setSrcHash(step.execution.srcTxHash)
							setDstHash(step.execution.dstTxHash)
						}
					}
				}
			})
		},
		[setStepStatus, setSrcHash, setDstHash],
	)
}
