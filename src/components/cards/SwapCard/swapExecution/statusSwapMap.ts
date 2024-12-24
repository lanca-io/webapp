import { SwapActionType, type SwapAction, StageType } from '../swapReducer/types'
import type { Dispatch } from 'react'
import { Status, StepType } from 'lanca-sdk-demo'
import { SwapCardStage } from '../swapReducer/types'

type swapStateFunction = (swapDispatch: Dispatch<SwapAction>) => void

export const statusSwapMap: Record<StepType, Record<Status, swapStateFunction>> = {
	[StepType.SWITCH_CHAIN]: {
		[Status.PENDING]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_LOADING, payload: true })
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.progress })
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [{ title: 'Signature required', status: Status.PENDING, type: StageType.approve }],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [{ title: 'Signature required', status: Status.SUCCESS, type: StageType.approve }],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Transaction failed',
						body: 'Internal error',
						status: Status.FAILED,
						type: StageType.error,
					},
				],
			})
		},
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [{ title: 'Transaction in progress...', status: Status.NOT_STARTED, type: StageType.approve }],
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
	[StepType.ALLOWANCE]: {
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Signature required',
						status: Status.PENDING,
						type: StageType.approve,
						body: 'Please open your wallet and sign the transaction',
					},
				],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [{ title: 'Signature required', status: Status.SUCCESS, type: StageType.approve }],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Transaction failed',
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
				payload: [{ title: 'Not started', status: Status.NOT_STARTED, type: StageType.approve }],
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
	[StepType.SRC_SWAP]: {
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{ title: 'Signature required', status: Status.SUCCESS, type: StageType.approve },
					{ title: 'Pending', status: Status.PENDING, type: StageType.transaction },
				],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.SET_SWAP_STAGE,
				payload: SwapCardStage.success,
			})
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{ title: 'Signature required', status: Status.SUCCESS, type: StageType.approve },
					{ title: 'Pending', status: Status.SUCCESS, type: StageType.transaction },
					{ title: 'Finished', status: Status.SUCCESS, type: StageType.success },
				],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Transaction failed',
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
				payload: [{ title: 'Not started', status: Status.NOT_STARTED, type: StageType.approve }],
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
	[StepType.DST_SWAP]: {
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{ title: 'Signature required', status: Status.SUCCESS, type: StageType.approve },
					{ title: 'Pending', status: Status.PENDING, type: StageType.transaction },
				],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.SET_SWAP_STAGE,
				payload: SwapCardStage.success,
			})
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{ title: 'Signature required', status: Status.SUCCESS, type: StageType.approve },
					{ title: 'Pending', status: Status.SUCCESS, type: StageType.transaction },
					{ title: 'Finished', status: Status.SUCCESS, type: StageType.success },
				],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Transaction failed',
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
				payload: [{ title: 'Not started', status: Status.NOT_STARTED, type: StageType.approve }],
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
	[StepType.BRIDGE]: {
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{ title: 'Signature required', status: Status.SUCCESS, type: StageType.approve },
					{ title: 'Pending', status: Status.PENDING, type: StageType.transaction },
				],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: SwapActionType.SET_SWAP_STAGE,
				payload: SwapCardStage.success,
			})
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{ title: 'Signature required', status: Status.SUCCESS, type: StageType.approve },
					{ title: 'Pending', status: Status.SUCCESS, type: StageType.transaction },
					{ title: 'Finished', status: Status.SUCCESS, type: StageType.success },
				],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
			swapDispatch({
				type: SwapActionType.SET_SWAP_STEPS,
				payload: [
					{
						title: 'Transaction failed',
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
				payload: [{ title: 'Not started', status: Status.NOT_STARTED, type: StageType.approve }],
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
}
