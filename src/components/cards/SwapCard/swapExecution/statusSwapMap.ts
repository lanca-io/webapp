import { SwapActionType, type SwapAction, StageType, TransactionType } from '../swapReducer/types'
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
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Approval Pending',
						status: Status.PENDING,
						type: StageType.approve,
						body: 'Approval is pending',
					},
				],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [{ title: 'Approval Successful', status: Status.SUCCESS, type: StageType.approve }],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Approval Failed',
						body: 'Something went wrong',
						status: Status.FAILED,
						type: StageType.error,
					},
				],
			})
		},
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [{ title: 'Approval Initiating', status: Status.NOT_STARTED, type: StageType.approve }],
			})
		},
		[Status.REJECTED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Approval rejected',
						body: 'User rejected the transaction',
						status: Status.REJECTED,
						type: StageType.error,
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
						title: 'Source Transaction Pending',
						status: Status.PENDING,
						type: StageType.transaction,
						txType: TransactionType.src_swap,
					},
				],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Source Transaction successful',
						status: Status.SUCCESS,
						type: StageType.transaction,
						txType: TransactionType.src_swap,
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
						title: 'Source Transaction failed',
						body: 'Something went wrong',
						status: Status.FAILED,
						type: StageType.error,
					},
				],
			})
		},
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_LOADING, payload: true })
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.progress })
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Source Transaction not started',
						status: Status.NOT_STARTED,
						type: StageType.transaction,
						txType: TransactionType.src_swap,
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
						title: 'Source Transaction rejected',
						body: 'User rejected the transaction',
						status: Status.REJECTED,
						type: StageType.error,
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
						title: 'Destination Transaction Pending',
						status: Status.PENDING,
						type: StageType.transaction,
						txType: TransactionType.dst_swap,
					},
				],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Destination Transaction Success',
						status: Status.SUCCESS,
						type: StageType.success,
						txType: TransactionType.dst_swap,
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
						title: 'Destination Transaction Failed',
						body: 'Something went wrong',
						status: Status.FAILED,
						type: StageType.error,
					},
				],
			})
		},
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Destination Transaction not started',
						status: Status.NOT_STARTED,
						type: StageType.transaction,
						txType: TransactionType.src_swap,
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
						title: 'Bridge Pending',
						status: Status.PENDING,
						type: StageType.transaction,
						txType: TransactionType.bridge,
					},
				],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.APPEND_SWAP_STEP,
				payload: [
					{
						title: 'Bridging Successfull',
						status: Status.SUCCESS,
						type: StageType.approve,
						txType: TransactionType.bridge,
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
					},
				],
			})
		},
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Bridging not started',
						status: Status.NOT_STARTED,
						type: StageType.transaction,
						txType: TransactionType.bridge,
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
						title: 'Bridging rejected',
						body: 'Transaction is rejected',
						status: Status.REJECTED,
						type: StageType.error,
					},
				],
			})
		},
	},
}
