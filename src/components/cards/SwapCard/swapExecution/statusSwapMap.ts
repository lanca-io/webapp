import { SwapActionType, type SwapAction, StageType } from '../swapReducer/types'
import type { Dispatch } from 'react'
import { type IRouteType, Status, StepType } from 'lanca-sdk-demo'
import { SwapCardStage } from '../swapReducer/types'
import { trackEvent } from '../../../../hooks/useTracking'
import { action, category } from '../../../../constants/tracking'

type swapStateFunction = (swapDispatch: Dispatch<SwapAction>, state: IRouteType) => void

export const statusSwapMap: Record<StepType, Record<Status, swapStateFunction>> = {
	// CHAIN SWITCHING
	[StepType.SWITCH_CHAIN]: {
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [{ title: 'Switch chain pending', status: Status.PENDING, type: StageType.chain }],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [{ title: 'Switch chain successfull', status: Status.SUCCESS, type: StageType.chain }],
			})
		},
		[Status.FAILED]: (swapDispatch, state) => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			trackEvent({
				category: category.SwapCard,
				action: action.SwapFailed,
				label: action.SwapFailed,
				data: { route: state },
			})
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Chain switch failed',
						body: 'Internal error',
						status: Status.FAILED,
						type: StageType.error,
					},
				],
			})
		},
		[Status.NOT_STARTED]: () => {},
		[Status.REJECTED]: (swapDispatch, state) => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			trackEvent({
				category: category.SwapCard,
				action: action.SwapRejected,
				label: 'User rejected chain switch',
				data: { route: state },
			})
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Chain switch rejected',
						body: 'Chain switch rejected',
						status: Status.REJECTED,
						type: StageType.error,
					},
				],
			})
		},
	},

	// APPROVAL
	[StepType.ALLOWANCE]: {
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Approval Pending',
						status: Status.PENDING,
						type: StageType.approve,
						txType: StepType.ALLOWANCE,
					},
				],
			})
		},
		[Status.SUCCESS]: (swapDispatch, state) => {
			const txHash = state.steps.find(
				step => step.type === StepType.ALLOWANCE && step.execution?.status === Status.SUCCESS,
			)?.execution?.txHash
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Approval Successful',
						status: Status.SUCCESS,
						type: StageType.approve,
						txType: StepType.ALLOWANCE,
						txLink: txHash,
					},
				],
			})
		},
		[Status.FAILED]: (swapDispatch, state) => {
			const txHash = state.steps.find(
				step => step.type === StepType.ALLOWANCE && step.execution?.status === Status.FAILED,
			)?.execution?.txHash
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			trackEvent({
				category: category.SwapCard,
				action: action.SwapFailed,
				label: 'swap_failed',
				data: { route: state, txHash },
			})
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Transaction failed',
						body: 'Something went wrong',
						status: Status.FAILED,
						type: StageType.error,
						txType: StepType.ALLOWANCE,
					},
				],
			})
		},
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Approval not started',
						status: Status.NOT_STARTED,
						type: StageType.approve,
						txType: StepType.ALLOWANCE,
					},
				],
			})
		},
		[Status.REJECTED]: (swapDispatch, state) => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			trackEvent({
				category: category.SwapCard,
				action: action.SwapRejected,
				label: action.SwapRejected,
				data: { route: state },
			})
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Transaction rejected',
						body: 'User rejected the transaction',
						status: Status.REJECTED,
						type: StageType.error,
						txType: StepType.ALLOWANCE,
					},
				],
			})
		},
	},

	// SRC_SWAP
	[StepType.SRC_SWAP]: {
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Swap in progress...',
						status: Status.PENDING,
						type: StageType.transaction,
						txType: StepType.SRC_SWAP,
					},
				],
			})
		},
		[Status.SUCCESS]: (swapDispatch, state) => {
			const txHash = state.steps.find(
				step => step.type === StepType.SRC_SWAP && step.execution?.status === Status.SUCCESS,
			)?.execution?.txHash
			const receivedAmount = state.steps.find(
				step => step.type === StepType.SRC_SWAP && step.execution?.status === Status.SUCCESS,
			)?.execution?.receivedAmount
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Swap success',
						status: Status.SUCCESS,
						type: StageType.transaction,
						txType: StepType.SRC_SWAP,
						txLink: txHash,
						receivedAmount,
					},
				],
			})
		},
		[Status.FAILED]: (swapDispatch, state) => {
			const txHash = state.steps.find(
				step => step.type === StepType.SRC_SWAP && step.execution?.status === Status.FAILED,
			)?.execution?.txHash
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			trackEvent({
				category: category.SwapCard,
				action: action.SwapFailed,
				label: 'swap_failed',
				data: { route: state, txHash },
			})
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Swap failed',
						body: 'Something went wrong',
						status: Status.FAILED,
						type: StageType.error,
						txType: StepType.SRC_SWAP,
					},
				],
			})
		},
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Swap in progress...',
						status: Status.NOT_STARTED,
						type: StageType.transaction,
						txType: StepType.SRC_SWAP,
					},
				],
			})
		},
		[Status.REJECTED]: (swapDispatch, state) => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			trackEvent({
				category: category.SwapCard,
				action: action.SwapRejected,
				label: action.SwapRejected,
				data: { route: state },
			})
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Transaction rejected',
						body: 'User rejected the transaction',
						status: Status.REJECTED,
						type: StageType.error,
						txType: StepType.SRC_SWAP,
					},
				],
			})
		},
	},

	// DST_SWAP
	[StepType.DST_SWAP]: {
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Swap in progress...',
						status: Status.PENDING,
						type: StageType.transaction,
						txType: StepType.DST_SWAP,
					},
				],
			})
		},
		[Status.SUCCESS]: (swapDispatch, state) => {
			const txHash = state.steps.find(
				step => step.type === StepType.DST_SWAP && step.execution?.status === Status.SUCCESS,
			)?.execution?.txHash
			const receivedAmount = state.steps.find(
				step => step.type === StepType.DST_SWAP && step.execution?.status === Status.SUCCESS,
			)?.execution?.receivedAmount
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Swap success',
						status: Status.SUCCESS,
						type: StageType.success,
						txType: StepType.DST_SWAP,
						txLink: txHash,
						receivedAmount,
					},
				],
			})
		},
		[Status.FAILED]: (swapDispatch, state) => {
			const txHash = state.steps.find(
				step => step.type === StepType.DST_SWAP && step.execution?.status === Status.FAILED,
			)?.execution?.txHash
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			trackEvent({
				category: category.SwapCard,
				action: action.SwapFailed,
				label: action.SwapFailed,
				data: { route: state, txHash },
			})
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Swap failed',
						body: 'Something went wrong',
						status: Status.FAILED,
						type: StageType.error,
						txType: StepType.DST_SWAP,
					},
				],
			})
		},
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Swap in progress...',
						status: Status.NOT_STARTED,
						type: StageType.transaction,
						txType: StepType.DST_SWAP,
					},
				],
			})
		},
		[Status.REJECTED]: (swapDispatch, state) => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			trackEvent({
				category: category.SwapCard,
				action: action.SwapRejected,
				label: action.SwapRejected,
				data: { route: state },
			})
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Transaction rejected',
						body: 'User rejected the transaction',
						status: Status.REJECTED,
						type: StageType.error,
						txType: StepType.DST_SWAP,
					},
				],
			})
		},
	},

	// BRIDGE
	[StepType.BRIDGE]: {
		[Status.PENDING]: (swapDispatch, state) => {
			const hasDstSwap = state.steps.some(step => step.type === StepType.DST_SWAP)
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: hasDstSwap ? 'Bridge & Swap in progress...' : 'Bridge in progress...',
						status: Status.PENDING,
						type: StageType.transaction,
						txType: StepType.BRIDGE,
					},
				],
			})
		},
		[Status.SUCCESS]: (swapDispatch, state) => {
			const hasDstSwap = state.steps.some(step => step.type === StepType.DST_SWAP)
			const txHash = state.steps.find(
				step => step.type === StepType.BRIDGE && step.execution?.status === Status.SUCCESS,
			)?.execution?.txHash
			const receivedAmount = state.steps.find(
				step => step.type === StepType.BRIDGE && step.execution?.status === Status.SUCCESS,
			)?.execution?.receivedAmount
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: hasDstSwap ? 'Bridge & Swap success' : 'Bridge success',
						status: Status.SUCCESS,
						type: StageType.approve,
						txType: StepType.BRIDGE,
						txLink: txHash,
						receivedAmount,
					},
				],
			})
		},
		[Status.FAILED]: (swapDispatch, state) => {
			const hasDstSwap = state.steps.some(step => step.type === StepType.DST_SWAP)
			const txHash = state.steps.find(
				step => step.type === StepType.BRIDGE && step.execution?.status === Status.FAILED,
			)?.execution?.txHash
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			trackEvent({
				category: category.SwapCard,
				action: action.SwapFailed,
				label: action.SwapFailed,
				data: { route: state, txHash },
			})
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: hasDstSwap ? 'Bridge & Swap failed' : 'Bridge failed',
						body: 'Something went wrong',
						status: Status.FAILED,
						type: StageType.error,
						txType: StepType.BRIDGE,
					},
				],
			})
		},
		[Status.NOT_STARTED]: (swapDispatch, state) => {
			const hasDstSwap = state.steps.some(step => step.type === StepType.DST_SWAP)
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: hasDstSwap ? 'Bridge & Swap in progress...' : 'Bridge in progress...',
						status: Status.NOT_STARTED,
						type: StageType.transaction,
						txType: StepType.BRIDGE,
					},
				],
			})
		},
		[Status.REJECTED]: (swapDispatch, state) => {
			const hasDstSwap = state.steps.some(step => step.type === StepType.DST_SWAP)
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			trackEvent({
				category: category.SwapCard,
				action: action.SwapRejected,
				label: action.SwapRejected,
				data: { route: state },
			})
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: hasDstSwap ? 'Bridge & Swap rejected' : 'Bridge rejected',
						body: 'Transaction is rejected',
						status: Status.REJECTED,
						type: StageType.error,
						txType: StepType.BRIDGE,
					},
				],
			})
		},
	},
}
