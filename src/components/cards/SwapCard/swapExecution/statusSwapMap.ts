import { SwapActionType, type SwapAction, StageType } from '../swapReducer/types'
import type { Dispatch } from 'react'
import { Status, StepType } from 'lanca-sdk-demo'
import { SwapCardStage } from '../swapReducer/types'

type swapStateFunction = (swapDispatch: Dispatch<SwapAction>) => void

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
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
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
		[Status.REJECTED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
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
			console.log('APPROVAL PENDING')
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
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Approval Successful',
						status: Status.SUCCESS,
						type: StageType.approve,
						txType: StepType.ALLOWANCE,
					},
				],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Transaction rejected',
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
		[Status.REJECTED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
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
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Swap success',
						status: Status.SUCCESS,
						type: StageType.transaction,
						txType: StepType.SRC_SWAP,
					},
				],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
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
		[Status.REJECTED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
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
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Swap success',
						status: Status.SUCCESS,
						type: StageType.success,
						txType: StepType.DST_SWAP,
					},
				],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
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
		[Status.REJECTED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
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
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Bridge in progress...',
						status: Status.PENDING,
						type: StageType.transaction,
						txType: StepType.BRIDGE,
					},
				],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Bridging success',
						status: Status.SUCCESS,
						type: StageType.approve,
						txType: StepType.BRIDGE,
					},
				],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Bridge failed',
						body: 'Something went wrong',
						status: Status.FAILED,
						type: StageType.error,
						txType: StepType.BRIDGE,
					},
				],
			})
		},
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Bridge in progress...',
						status: Status.NOT_STARTED,
						type: StageType.transaction,
						txType: StepType.BRIDGE,
					},
				],
			})
		},
		[Status.REJECTED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Transaction rejected',
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
