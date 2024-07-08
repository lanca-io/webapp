import { type ExecuteRouteStage, type ExecutionState } from '../../../../sdk/types/executeSettingsTypes'
import { type SwapAction, SwapCardStage } from '../swapReducer/types'
import type { Dispatch } from 'react'

type swapStateFunction = (swapDispatch: Dispatch<SwapAction>, state: ExecutionState) => void

export const statusSwapMap: Record<ExecuteRouteStage, swapStateFunction> = {
	SET_CHAIN: swapDispatch => {
		swapDispatch({ type: 'SET_LOADING', payload: true })
		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.progress })
		swapDispatch({
			type: 'APPEND_SWAP_STEP',
			payload: {
				title: 'Action required',
				body: 'Please approve the transaction in your wallet',
				status: 'await',
				txLink: null,
			},
		})
	},
	SET_ADDRESS: swapDispatch => {
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [
				{
					title: 'Action required',
					body: 'Please approve the transaction in your wallet',
					status: 'await',
					txLink: null,
				},
			],
		})
	},
	CHECK_ALLOWANCE: (swapDispatch, state) => {
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [
				{
					title: 'Action required',
					body: 'Please approve the transaction in your wallet',
					status: 'await',
					txLink: null,
				},
			],
		})
	},
	PENGING_TRANSACTION: swapDispatch => {
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [{ status: 'pending', title: 'Sending transaction' }],
		})
	},
	CONFIRMING_TRANSACTION: swapDispatch => {
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [
				{ status: 'success', title: 'Sending transaction' },
				{
					status: 'pending',
					title: 'Confirming transaction',
				},
			],
		})
	},
	SUCCESS_TRANSACTION: swapDispatch => {
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [
				{ status: 'success', title: 'Sending transaction' },
				{
					status: 'success',
					title: 'Confirming transaction',
				},
				{
					status: 'success',
					title: 'Complete',
				},
			],
		})

		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.success })
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
