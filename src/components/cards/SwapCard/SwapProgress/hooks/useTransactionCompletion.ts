import { useEffect, type Dispatch } from 'react'
import { SwapActionType, SwapCardStage, type SwapAction } from '../../swapReducer/types'
import { Status } from 'lanca-sdk-demo'
import { trackEvent } from '../../../../../hooks/useTracking'
import { action, category } from '../../../../../constants/tracking'

export const useTransactionCompletion = (steps: any[], selectedRoute: any, swapDispatch: Dispatch<SwapAction>) => {
	useEffect(() => {
		const lastStepType = selectedRoute?.steps[selectedRoute.steps.length - 1]?.type
		const isTxCompleted = steps.some(step => step.txType === lastStepType && step.status === Status.SUCCESS)
		const txHash = isTxCompleted
			? steps.find(step => step.txType === lastStepType && step.status === Status.SUCCESS)?.txLink
			: null
		if (isTxCompleted) {
			swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.success })
			trackEvent({
				category: category.SwapCard,
				action: action.SwapSuccess,
				label: 'swap_success',
				data: { route: selectedRoute, txHash },
			})
		}
	}, [steps, selectedRoute, swapDispatch])
}
