import { SwapActionType, type SwapAction, StageType } from '../swapReducer/types'
import type { Dispatch } from 'react'
import { type IRouteType, Status, StepType, type ITxStep, type ITxStepSwap, type ITxStepBridge } from '@lanca/sdk'
import { SwapCardStage } from '../swapReducer/types'
import { trackEvent } from '../../../../hooks/useTracking'
import { action, category } from '../../../../constants/tracking'

type swapStateFunction = (swapDispatch: Dispatch<SwapAction>, state: IRouteType) => void

function hasTxHash(execution: Partial<ITxStep>): execution is ITxStepSwap | ITxStepBridge {
	return (
		(execution as ITxStepSwap).txHash !== undefined ||
		((execution as ITxStepBridge).srcTxHash !== undefined && (execution as ITxStepBridge).dstTxHash !== undefined)
	)
}

function getTxHash(step: ITxStep | undefined): string | undefined {
	if (step && 'execution' in step && hasTxHash(step.execution as Partial<ITxStep>)) {
		return (step.execution as ITxStepSwap).txHash || (step.execution as ITxStepBridge).srcTxHash
	}
	return undefined
}

function handleFailed(swapDispatch: Dispatch<SwapAction>, state: IRouteType, stepType: StepType) {
	const step = state.steps.find(step => step.type === stepType && step.execution?.status === Status.FAILED)
	const txHash = getTxHash(step as ITxStep)
	swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
	trackEvent({
		category: category.SwapCard,
		action: action.SwapFailed,
		label: action.SwapFailed,
		data: { route: state, txHash },
	})
	swapDispatch({
		type: SwapActionType.APPEND_SWAP_STEP,
		payload: [
			{
				title: 'Transaction failed',
				body: 'Something went wrong',
				status: Status.FAILED,
				type: StageType.error,
				txType: stepType,
			},
		],
	})
}

function handleRejected(swapDispatch: Dispatch<SwapAction>, state: IRouteType, stepType: StepType) {
	const step = state.steps.find(step => step.type === stepType && step.execution?.status === Status.REJECTED)
	const txHash = getTxHash(step as ITxStep)
	swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
	trackEvent({
		category: category.SwapCard,
		action: action.SwapRejected,
		label: action.SwapRejected,
		data: { route: state, txHash },
	})
	swapDispatch({
		type: SwapActionType.APPEND_SWAP_STEP,
		payload: [
			{
				title: 'Transaction rejected',
				body: 'User rejected the transaction',
				status: Status.REJECTED,
				type: StageType.error,
				txType: stepType,
			},
		],
	})
}

function handleNotStarted(swapDispatch: Dispatch<SwapAction>, stepType: StepType, title: string, stage: StageType) {
	swapDispatch({
		type: SwapActionType.APPEND_SWAP_STEP,
		payload: [
			{
				title,
				status: Status.NOT_STARTED,
				type: stage,
				txType: stepType,
			},
		],
	})
}

function handlePending(swapDispatch: Dispatch<SwapAction>, stepType: StepType, title: string, stage: StageType) {
	swapDispatch({
		type: SwapActionType.APPEND_SWAP_STEP,
		payload: [
			{
				title,
				status: Status.PENDING,
				type: stage,
				txType: stepType,
			},
		],
	})
}

function handleSuccess(
	swapDispatch: Dispatch<SwapAction>,
	state: IRouteType,
	stepType: StepType,
	title: string,
	stage: StageType,
) {
	const step = state.steps.find(step => step.type === stepType && step.execution?.status === Status.SUCCESS)
	const txHash = getTxHash(step as ITxStep)
	const receivedAmount = step?.execution?.receivedAmount
	swapDispatch({
		type: SwapActionType.APPEND_SWAP_STEP,
		payload: [
			{
				title,
				status: Status.SUCCESS,
				type: stage,
				txType: stepType,
				txLink: txHash,
				receivedAmount,
			},
		],
	})
}

export const statusSwapMap: Record<StepType, Record<Status, swapStateFunction>> = {
	// CHAIN SWITCHING
	[StepType.SWITCH_CHAIN]: {
		[Status.PENDING]: swapDispatch => {
			handlePending(swapDispatch, StepType.SWITCH_CHAIN, 'Switch chain pending', StageType.chain)
		},
		[Status.SUCCESS]: (swapDispatch, state) => {
			handleSuccess(swapDispatch, state, StepType.SWITCH_CHAIN, 'Switch chain successful', StageType.chain)
		},
		[Status.FAILED]: (swapDispatch, state) => {
			handleFailed(swapDispatch, state, StepType.SWITCH_CHAIN)
		},
		[Status.NOT_STARTED]: swapDispatch => {
			handleNotStarted(swapDispatch, StepType.SWITCH_CHAIN, 'Switch chain not started', StageType.chain)
		},
		[Status.REJECTED]: (swapDispatch, state) => {
			handleRejected(swapDispatch, state, StepType.SWITCH_CHAIN)
		},
	},

	// APPROVAL
	[StepType.ALLOWANCE]: {
		[Status.PENDING]: swapDispatch => {
			handlePending(swapDispatch, StepType.ALLOWANCE, 'Approval Pending', StageType.approve)
		},
		[Status.SUCCESS]: (swapDispatch, state) => {
			handleSuccess(swapDispatch, state, StepType.ALLOWANCE, 'Approval Successful', StageType.approve)
		},
		[Status.FAILED]: (swapDispatch, state) => {
			handleFailed(swapDispatch, state, StepType.ALLOWANCE)
		},
		[Status.NOT_STARTED]: swapDispatch => {
			handleNotStarted(swapDispatch, StepType.ALLOWANCE, 'Approval not started', StageType.approve)
		},
		[Status.REJECTED]: (swapDispatch, state) => {
			handleRejected(swapDispatch, state, StepType.ALLOWANCE)
		},
	},

	// SRC_SWAP
	[StepType.SRC_SWAP]: {
		[Status.PENDING]: swapDispatch => {
			handlePending(swapDispatch, StepType.SRC_SWAP, 'Swap in progress...', StageType.transaction)
		},
		[Status.SUCCESS]: (swapDispatch, state) => {
			handleSuccess(swapDispatch, state, StepType.SRC_SWAP, 'Swap success', StageType.transaction)
		},
		[Status.FAILED]: (swapDispatch, state) => {
			handleFailed(swapDispatch, state, StepType.SRC_SWAP)
		},
		[Status.NOT_STARTED]: swapDispatch => {
			handleNotStarted(swapDispatch, StepType.SRC_SWAP, 'Swap in progress...', StageType.transaction)
		},
		[Status.REJECTED]: (swapDispatch, state) => {
			handleRejected(swapDispatch, state, StepType.SRC_SWAP)
		},
	},

	// DST_SWAP
	[StepType.DST_SWAP]: {
		[Status.PENDING]: swapDispatch => {
			handlePending(swapDispatch, StepType.DST_SWAP, 'Swap in progress...', StageType.transaction)
		},
		[Status.SUCCESS]: (swapDispatch, state) => {
			handleSuccess(swapDispatch, state, StepType.DST_SWAP, 'Swap success', StageType.success)
		},
		[Status.FAILED]: (swapDispatch, state) => {
			handleFailed(swapDispatch, state, StepType.DST_SWAP)
		},
		[Status.NOT_STARTED]: swapDispatch => {
			handleNotStarted(swapDispatch, StepType.DST_SWAP, 'Swap in progress...', StageType.transaction)
		},
		[Status.REJECTED]: (swapDispatch, state) => {
			handleRejected(swapDispatch, state, StepType.DST_SWAP)
		},
	},

	// BRIDGE
	[StepType.BRIDGE]: {
		[Status.PENDING]: swapDispatch => {
			handlePending(swapDispatch, StepType.BRIDGE, 'Bridge in progress...', StageType.transaction)
		},
		[Status.SUCCESS]: (swapDispatch, state) => {
			handleSuccess(swapDispatch, state, StepType.BRIDGE, 'Bridge success', StageType.approve)
		},
		[Status.FAILED]: (swapDispatch, state) => {
			handleFailed(swapDispatch, state, StepType.BRIDGE)
		},
		[Status.NOT_STARTED]: swapDispatch => {
			handleNotStarted(swapDispatch, StepType.BRIDGE, 'Bridge in progress...', StageType.transaction)
		},
		[Status.REJECTED]: (swapDispatch, state) => {
			handleRejected(swapDispatch, state, StepType.BRIDGE)
		},
	},
}
