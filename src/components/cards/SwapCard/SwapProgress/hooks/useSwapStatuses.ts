import { useState, useEffect } from 'react'
import { Status, StepType } from 'lanca-sdk-demo'
import { type StageStep } from '../../swapReducer/types'

interface SwapStatusesProps {
	steps: StageStep[]
}

export const useSwapStatuses = ({ steps }: SwapStatusesProps) => {
	const [originalSteps, setOriginalSteps] = useState<StageStep[]>([])
	const [swapStatus, setSwapStatus] = useState<Status>(Status.NOT_STARTED)
	const [bridgeStatus, setBridgeStatus] = useState<Status>(Status.NOT_STARTED)
	const [dstSwapStatus, setDstSwapStatus] = useState<Status>(Status.NOT_STARTED)

	useEffect(() => {
		if (steps.length > 0) {
			setOriginalSteps(steps)
		}
	}, [steps])

	useEffect(() => {
		const lastSwapStep = steps
			.slice()
			.reverse()
			.find(step => step.txType === StepType.SRC_SWAP)
		if (lastSwapStep && lastSwapStep.status !== swapStatus) {
			setSwapStatus(lastSwapStep.status)
		}
	}, [steps, swapStatus])

	useEffect(() => {
		const lastBridgeStep = steps
			.slice()
			.reverse()
			.find(step => step.txType === StepType.BRIDGE)
		if (lastBridgeStep && lastBridgeStep.status !== bridgeStatus) {
			setBridgeStatus(lastBridgeStep.status)
		}
	}, [steps, bridgeStatus])

	useEffect(() => {
		const lastDstSwapStep = steps
			.slice()
			.reverse()
			.find(step => step.txType === StepType.DST_SWAP)
		if (lastDstSwapStep && lastDstSwapStep.status !== dstSwapStatus) {
			setDstSwapStatus(lastDstSwapStep.status)
		}
	}, [steps, dstSwapStatus])

	const getLastStatus = (txType: StepType) => {
		const step = originalSteps
			.slice()
			.reverse()
			.find(step => step.txType === txType)
		return step ? (step.status) : Status.NOT_STARTED
	}

	const approvalStatus = getLastStatus(StepType.ALLOWANCE)

	return {
		approvalStatus,
		swapStatus,
		bridgeStatus,
		dstSwapStatus,
	}
}
