import { type Dispatch } from 'react'
import { type SwapAction, SwapCardStage, type StageStep } from '../swapReducer/types'
import { SwapActionType } from '../swapReducer/types'
import { logTxToDB } from '../../../../utils/logTxToDB'
import { action, category } from '../../../../constants/tracking'
import { trackEvent } from '../../../../hooks/useTracking'
import { type IRouteType, Status } from '@lanca/sdk'

const dispatchSwapStep = (swapDispatch: Dispatch<SwapAction>, title: string, body: string, status: Status) => {
	const step: StageStep = { title, body, status }
	swapDispatch({
		type: SwapActionType.APPEND_SWAP_STEP,
		payload: [step],
	})
}
const trackSwapEvent = (eventCategory: string, eventAction: string, label: string, data: any) => {
	trackEvent({
		category: eventCategory,
		action: eventAction,
		label,
		data,
	})
}

const logTransaction = (selectedRoute: IRouteType, status: string) => {
	logTxToDB({
		status,
		tx_data: selectedRoute,
	})
}

export const handleTransactionError = (e: Error, swapDispatch: Dispatch<SwapAction>, selectedRoute: IRouteType) => {
	swapDispatch({ type: SwapActionType.UPDATE_LAST_SWAP_STEP })
	const errorMessage = e.toString().toLowerCase()

	if (errorMessage.includes('user rejected')) {
		dispatchSwapStep(swapDispatch, 'Cancelled by user', 'Transaction was cancelled', Status.REJECTED)
		trackSwapEvent(category.SwapCard, action.SwapRejected, 'User rejected swap', { stdRoute: selectedRoute })
	} else if (errorMessage.includes('insufficient')) {
		dispatchSwapStep(swapDispatch, 'Insufficient balance', 'Please check your balance and try again', Status.FAILED)
		trackSwapEvent(category.SwapCard, action.SwapFailed, 'swap_failed', {
			selectedRoute,
		})
		logTransaction(selectedRoute, 'failure')
	} else {
		dispatchSwapStep(swapDispatch, 'Transaction failed', 'Something went wrong', Status.FAILED)
		trackSwapEvent(category.SwapCard, action.SwapFailed, 'swap_failed', {
			selectedRoute,
		})
		logTransaction(selectedRoute, 'failure')
	}

	swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
}
