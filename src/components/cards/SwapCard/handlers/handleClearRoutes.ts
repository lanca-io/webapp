import { type Dispatch, type MutableRefObject } from 'react'
import { type SwapAction, SwapActionType, SwapCardStage } from '../swapReducer/types'

export const clearRoutes = (
	typingTimeoutRef: MutableRefObject<number | undefined>,
	swapDispatch: Dispatch<SwapAction>,
) => {
	if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
	swapDispatch({ type: SwapActionType.CLEAR_ROUTES })
	swapDispatch({ type: SwapActionType.RESET_AMOUNTS, direction: 'to' })
	swapDispatch({ type: SwapActionType.SET_IS_NO_ROUTES, status: false })
	swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.input })
}
