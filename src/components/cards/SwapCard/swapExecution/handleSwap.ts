import { handleTransactionError } from '../handlers/handleTransactionError'
import { type Dispatch } from 'react'
import { type SwapAction, SwapCardStage, type SwapState } from '../swapReducer/types'
import { executeConceroRoute } from './executeConceroRoute'
import { ErrorType } from '../SwapButton/constants'

interface HandleSwapProps {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
}

export const handleSwap = async ({ swapState, swapDispatch }: HandleSwapProps): Promise<void> => {
	const { selectedRoute } = swapState

	if (swapState.from.amount.length === 0) {
		swapDispatch({ type: 'SET_INPUT_ERROR', payload: ErrorType.ENTER_AMOUNT })
		return
	}

	if (!selectedRoute) {
		console.error('No original route passed')
		return
	}

	swapDispatch({ type: 'SET_LOADING', payload: true })
	swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.progress })

	try {
		await executeConceroRoute(swapState, swapDispatch, selectedRoute)
	} catch (error: Error) {
		handleTransactionError(error, swapDispatch, selectedRoute)
	} finally {
		swapDispatch({ type: 'SET_LOADING', payload: false })
	}
}
