import { useEffect, type Dispatch } from 'react'
import { SwapActionType, SwapCardStage, type SwapAction } from '../../swapReducer/types'
import { Status } from 'lanca-sdk-demo'

export const useTransactionCompletion = (steps: any[], selectedRoute: any, swapDispatch: Dispatch<SwapAction>) => {
	useEffect(() => {
		const lastStepType = selectedRoute?.steps[selectedRoute.steps.length - 1]?.type
		const isTxCompleted = steps.some(step => step.txType === lastStepType && step.status === Status.SUCCESS)
		if (isTxCompleted) {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.success })
			swapDispatch({ type: SwapActionType.SET_SWAP_STEPS, payload: [] })
		}
	}, [steps, selectedRoute, swapDispatch])
}
