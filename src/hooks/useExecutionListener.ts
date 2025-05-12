import type { Hash } from 'viem'
import type { IRouteType, ITxStep } from '@lanca/sdk'
import { Status } from '@lanca/sdk'
import { useTxExecutionStore } from '../store/tx-execution/useTxExecutionStore'
import { useCallback } from 'react'

type ExtendedTxStep = ITxStep & {
	srcTxHash: Hash
	dstTxHash: Hash
}

function hasHashes(execution: Partial<ITxStep> | undefined): execution is Partial<ExtendedTxStep> {
	return !!execution && 'srcTxHash' in execution && 'dstTxHash' in execution
}

export const useExecutionListener = () => {
	const { setSrcHash, setDstHash, setStepStatus, steps: storeSteps } = useTxExecutionStore()

	return useCallback(
		(state: IRouteType) => {
			if (!state?.steps?.length) return

			state.steps.forEach((apiStep, index) => {
				const storeStep = storeSteps[index]

				if (storeStep?.type === apiStep.type) {
					if (apiStep.execution?.status) {
						setStepStatus(index, apiStep.execution.status)

						if (apiStep.execution.status === Status.SUCCESS && hasHashes(apiStep.execution)) {
							if (apiStep.execution.srcTxHash && apiStep.execution.dstTxHash) {
								setSrcHash(apiStep.execution.srcTxHash)
								setDstHash(apiStep.execution.dstTxHash)
							}
						}
					}
				}
			})
		},
		[setStepStatus, setSrcHash, setDstHash, storeSteps],
	)
}
