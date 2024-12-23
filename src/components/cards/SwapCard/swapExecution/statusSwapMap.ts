import { type SwapAction, SwapActionType, type StageStep } from '../swapReducer/types'
import type { Dispatch } from 'react'
import { type RouteType, Status, StepType } from 'lanca-sdk-demo'

type swapStateFunction = (swapDispatch: Dispatch<SwapAction>, state: RouteType) => void

const handleStatusChange = (swapDispatch: Dispatch<SwapAction>, status: Status, stepType: StepType) => {
	const step: StageStep = {
		title: `${stepType} ${status.toLowerCase()}`,
		status,
		type: stepType,
	}

	switch (status) {
		case Status.PENDING:
			step.title = 'Pending approval'
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [step],
			})
			break
		case Status.SUCCESS:
			step.title = 'Transaction successful'
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [step],
			})
			break
		case Status.FAILED:
			step.title = 'Transaction failed'
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [step],
			})
			break
		case Status.NOT_STARTED:
			step.title = 'Transaction not started'
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [step],
			})
			break
		case Status.REJECTED:
			step.title = 'Transaction rejected'
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [step],
			})
			break
	}
}

export const statusSwapMap: Record<StepType, swapStateFunction> = {
	[StepType.SRC_SWAP]: (swapDispatch, state) => {
		const lastStep = state.steps.find(step => step.type === StepType.SRC_SWAP)
		if (lastStep?.execution) {
			handleStatusChange(swapDispatch, lastStep.execution.status, StepType.SRC_SWAP)
		}
	},
	[StepType.BRIDGE]: (swapDispatch, state) => {
		const lastStep = state.steps.find(step => step.type === StepType.BRIDGE)
		if (lastStep?.execution) {
			handleStatusChange(swapDispatch, lastStep.execution.status, StepType.BRIDGE)
		}
	},
	[StepType.DST_SWAP]: (swapDispatch, state) => {
		const lastStep = state.steps.find(step => step.type === StepType.DST_SWAP)
		if (lastStep?.execution) {
			handleStatusChange(swapDispatch, lastStep.execution.status, StepType.DST_SWAP)
		}
	},
	[StepType.ALLOWANCE]: (swapDispatch, state) => {
		const lastStep = state.steps.find(step => step.type === StepType.ALLOWANCE)
		if (lastStep?.execution) {
			handleStatusChange(swapDispatch, lastStep.execution.status, StepType.ALLOWANCE)
		}
	},
	[StepType.SWITCH_CHAIN]: (swapDispatch, state) => {
		const lastStep = state.steps.find(step => step.type === StepType.SWITCH_CHAIN)
		if (lastStep?.execution) {
			handleStatusChange(swapDispatch, lastStep.execution.status, StepType.SWITCH_CHAIN)
		}
	},
}
