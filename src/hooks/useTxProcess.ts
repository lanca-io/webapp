import { useMemo } from 'react'
import { useTxExecutionStore } from '../store/tx-execution/useTxExecutionStore'
import { Status } from '@lanca/sdk'

export const useTxProcess = () => {
	const { overallStatus: txStatus, steps, srcHash, dstHash, executionTime } = useTxExecutionStore()

	const currentStage = useMemo(() => {
		switch (txStatus) {
			case Status.SUCCESS:
				return 'success'
			case Status.FAILED:
				return 'failed'
			case Status.REJECTED:
				return 'rejected'
			case Status.PENDING:
				return 'pending'
			default:
				return 'not_started'
		}
	}, [txStatus])

	const currentStep = useMemo(() => {
		const activeStep = steps.find(step => [Status.PENDING, Status.REJECTED, Status.FAILED].includes(step.status))
		return activeStep?.type || null
	}, [steps])

	const isTerminalStage = useMemo(() => {
		return ['success', 'failed', 'rejected'].includes(currentStage)
	}, [currentStage])

	return {
		txStatus,
		currentStage,
		currentStep,
		isTerminalStage,
		srcHash,
		dstHash,
		executionTime,
	}
}
