import { type Dispatch, type MutableRefObject } from 'react'
import { type SwapAction, type SwapState } from '../swapReducer/types'
import { getRoutes } from '../getRoutes/getRoutes'
import { getPoolAmount } from './getPoolAmount'
import { ErrorType } from '../SwapButton/constants'
import { getInputError } from '../SwapButton/getInputError'

export const handleFetchRoutes = async (
	swapState: SwapState,
	swapDispatch: Dispatch<SwapAction>,
	typingTimeoutRef: MutableRefObject<number | undefined>,
) => {
	try {
		if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)

		const typingTimeoutId = setTimeout(async () => {
			const { from, to, buttonState } = swapState

			const error = getInputError(swapState)
			swapDispatch({ type: 'SET_INPUT_ERROR', payload: error })

			if (error) return

			const isWrongRangeAmount = buttonState.type === ErrorType.AMOUNT_TOO_LOW

			swapDispatch({ type: 'SET_IS_SUFFICIENT_LIQUIDITY', payload: true })

			if (isWrongRangeAmount) return

			await getRoutes(swapState, swapDispatch)
		}, 700)

		typingTimeoutRef.current = typingTimeoutId
	} catch (e) {
		console.error(e)
		swapDispatch({ type: 'SET_LOADING', payload: false })
	}
}
