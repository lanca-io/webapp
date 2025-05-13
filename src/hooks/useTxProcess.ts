import { useMemo, useEffect } from 'react'
import { useTxExecutionStore } from '../store/tx-execution/useTxExecutionStore'
import { Status } from '@lanca/sdk'

export const useTxProcess = () => {
	const { overallStatus: txStatus, steps, srcHash, dstHash, executionTime } = useTxExecutionStore()

	// Log the initial values from store
	useEffect(() => {
		console.log('[TxProcess] Current state:', {
			txStatus,
			steps: steps.map(s => ({ type: s.type, status: s.status })),
			srcHash,
			dstHash,
			executionTime,
		})
	}, [txStatus, steps, srcHash, dstHash, executionTime])

	const currentStage = useMemo(() => {
		let stage
		switch (txStatus) {
			case Status.SUCCESS:
				stage = 'success'
				break
			case Status.FAILED:
				stage = 'failed'
				break
			case Status.REJECTED:
				stage = 'rejected'
				break
			case Status.PENDING:
				stage = 'pending'
				break
			default:
				stage = 'not_started'
		}
		console.log('[TxProcess] Current stage:', stage, 'from status:', txStatus)
		return stage
	}, [txStatus])

	const currentStep = useMemo(() => {
		const activeStep = steps.find(step => [Status.PENDING, Status.REJECTED, Status.FAILED].includes(step.status))
		const stepType = activeStep?.type || null
		console.log(
			'[TxProcess] Current active step:',
			stepType,
			activeStep ? `(status: ${activeStep.status})` : '(no active step)',
		)
		return stepType
	}, [steps])

	const isTerminalStage = useMemo(() => {
		const isTerminal = ['success', 'failed', 'rejected'].includes(currentStage)
		console.log('[TxProcess] Is terminal stage:', isTerminal)
		return isTerminal
	}, [currentStage])

	// Log the final return values
	useEffect(() => {
		console.log('[TxProcess] Returning:', {
			txStatus,
			currentStage,
			currentStep,
			isTerminalStage,
			srcHash,
			dstHash,
			executionTime,
		})
	}, [txStatus, currentStage, currentStep, isTerminalStage, srcHash, dstHash, executionTime])

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
