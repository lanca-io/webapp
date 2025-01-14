import { handleTransactionError } from '../handlers/handleTransactionError'
import { type Dispatch } from 'react'
import { type SwapAction, SwapActionType, SwapCardStage, type SwapState } from '../swapReducer/types'
import { executeConceroRoute } from './executeConceroRoute'
import { ErrorType } from '../SwapButton/constants'
import { type WalletClient } from 'viem'

interface HandleSwapProps {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
	walletClient: WalletClient
}

export const handleSwap = async ({ swapState, swapDispatch, walletClient }: HandleSwapProps): Promise<void> => {
	const { selectedRoute } = swapState

	if (!selectedRoute) {
		console.error('No original route passed')
		return
	}

	if (swapState.from.amount.length === 0) {
		swapDispatch({ type: SwapActionType.SET_INPUT_ERROR, payload: ErrorType.ENTER_AMOUNT })
		return
	}

	swapDispatch({ type: SwapActionType.SET_LOADING, payload: true })
	swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.progress })

	try {
		await executeConceroRoute({ swapState, swapDispatch, route: selectedRoute, walletClient })
	} catch (error: any) {
		handleTransactionError(error, swapDispatch, selectedRoute)
	} finally {
		swapDispatch({ type: SwapActionType.SET_LOADING, payload: false })
	}
}
