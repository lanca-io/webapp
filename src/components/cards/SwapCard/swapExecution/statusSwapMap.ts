import { StageType, type SwapAction, SwapCardStage } from '../swapReducer/types'
import type { Dispatch } from 'react'
import { StepType, Status, type RouteType } from 'lanca-sdk-demo'

type swapStateFunction = (swapDispatch: Dispatch<SwapAction>, state: RouteType) => void

export const statusSwapMap: Record<StepType, Record<Status, swapStateFunction>> = {
	[StepType.SRC_SWAP]: {
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({ type: 'SET_LOADING', payload: true })
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.progress })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Source Swap Not Started', status: Status.NOT_STARTED, type: StageType.approve }],
			})
		},
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Source Swap Pending', status: Status.PENDING, type: StageType.transaction }],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Source Swap Success', status: Status.SUCCESS, type: StageType.transaction }],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Source Swap Failed', status: Status.FAILED, type: StageType.error }],
			})
		},
		[Status.REJECTED]: swapDispatch => {
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Source Swap Rejected', status: Status.REJECTED, type: StageType.error }],
			})
		},
	},
	[StepType.BRIDGE]: {
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({ type: 'SET_LOADING', payload: true })
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.progress })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Bridge Not Started', status: Status.NOT_STARTED, type: StageType.approve }],
			})
		},
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Bridge Pending', status: Status.PENDING, type: StageType.transaction }],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Bridge Success', status: Status.SUCCESS, type: StageType.transaction }],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Bridge Failed', status: Status.FAILED, type: StageType.error }],
			})
		},
		[Status.REJECTED]: swapDispatch => {
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Bridge Rejected', status: Status.REJECTED, type: StageType.error }],
			})
		},
	},
	[StepType.DST_SWAP]: {
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({ type: 'SET_LOADING', payload: true })
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.progress })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [
					{ title: 'Destination Swap Not Started', status: Status.NOT_STARTED, type: StageType.approve },
				],
			})
		},
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Destination Swap Pending', status: Status.PENDING, type: StageType.transaction }],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Destination Swap Success', status: Status.SUCCESS, type: StageType.transaction }],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Destination Swap Failed', status: Status.FAILED, type: StageType.error }],
			})
		},
		[Status.REJECTED]: swapDispatch => {
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Destination Swap Rejected', status: Status.REJECTED, type: StageType.error }],
			})
		},
	},
	[StepType.ALLOWANCE]: {
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({ type: 'SET_LOADING', payload: true })
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.progress })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Allowance Not Started', status: Status.NOT_STARTED, type: StageType.approve }],
			})
		},
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Allowance Pending', status: Status.PENDING, type: StageType.transaction }],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Allowance Success', status: Status.SUCCESS, type: StageType.transaction }],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Allowance Failed', status: Status.FAILED, type: StageType.error }],
			})
		},
		[Status.REJECTED]: swapDispatch => {
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Allowance Rejected', status: Status.REJECTED, type: StageType.error }],
			})
		},
	},
	[StepType.SWITCH_CHAIN]: {
		[Status.NOT_STARTED]: swapDispatch => {
			swapDispatch({ type: 'SET_LOADING', payload: true })
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.progress })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Switch Chain Not Started', status: Status.NOT_STARTED, type: StageType.approve }],
			})
		},
		[Status.PENDING]: swapDispatch => {
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Switch Chain Pending', status: Status.PENDING, type: StageType.transaction }],
			})
		},
		[Status.SUCCESS]: swapDispatch => {
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Switch Chain Success', status: Status.SUCCESS, type: StageType.transaction }],
			})
		},
		[Status.FAILED]: swapDispatch => {
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Switch Chain Failed', status: Status.FAILED, type: StageType.error }],
			})
		},
		[Status.REJECTED]: swapDispatch => {
			swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
			swapDispatch({
				type: 'SET_SWAP_STEPS',
				payload: [{ title: 'Switch Chain Rejected', status: Status.REJECTED, type: StageType.error }],
			})
		},
	},
}
