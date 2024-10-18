import { type ExecuteRouteStage, type ExecutionState } from '../../../../sdk/types/executeSettingsTypes'
import { StageType, type SwapAction, SwapCardStage } from '../swapReducer/types'
import type { Dispatch } from 'react'

type swapStateFunction = (swapDispatch: Dispatch<SwapAction>, state: ExecutionState) => void

export const statusSwapMap: Record<ExecuteRouteStage, swapStateFunction> = {
	SET_CHAIN: swapDispatch => {
		swapDispatch({ type: 'SET_LOADING', payload: true })
		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.progress })

		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [{ title: 'Signature required', status: 'await', type: StageType.approve }],
		})
	},
	SET_ADDRESS: () => {},
	CHECK_ALLOWANCE: swapDispatch => {
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [
				{
					title: 'Signature required',
					status: 'await',
					type: StageType.approve,
					body: 'Please open your wallet and sign the transaction',
				},
			],
		})
	},
	AWAIT_APPROVE: swapDispatch => {
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [{ title: 'Signature required', status: 'await', type: StageType.approve }],
		})
	},
	PENDING_APPROVE: swapDispatch => {
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [{ title: 'Pending approve', status: 'pending', type: StageType.approve }],
		})
	},
	CONFIRMING_TRANSACTION: swapDispatch => {
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [
				{ title: 'Signature required', status: 'success', type: StageType.approve },
				{ title: 'transaction confirmation', status: 'await', type: StageType.transaction },
			],
		})
	},
	PENDING_TRANSACTION: swapDispatch => {
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [
				{ title: 'Signature required', status: 'success', type: StageType.approve },
				{ title: 'Pending', status: 'pending', type: StageType.transaction },
			],
		})
	},
	SUCCESS_TRANSACTION: swapDispatch => {
		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.success })

		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [
				{ title: 'Signature required', status: 'success', type: StageType.approve },
				{ title: 'Pending', status: 'success', type: StageType.transaction },
				{ title: 'Finished', status: 'success', type: StageType.success },
			],
		})
	},
	LONG_DURATION_CONFIRMING: (swapDispatch, state) => {
		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.warning })

		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [
				{
					status: 'pending',
					title: 'Dont worry',
					body: 'Your funds are safe but it will take a bit longer to complete the transaction.',
					type: StageType.warning,
					txLink: state.payload?.ccipId,
				},
			],
		})
	},
	FAILED_TRANSACTION: swapDispatch => {
		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [{ title: 'Transaction failed', body: 'Something went wrong', status: 'error' }],
		})
	},
	INTERNAL_ERROR: swapDispatch => {
		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [{ title: 'Transaction failed', body: 'Internal error', status: 'error' }],
		})
	},
}
