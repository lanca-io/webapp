import { type Dispatch, type MutableRefObject } from 'react'
import { SwapActionType, type SwapAction, type SwapState } from '../swapReducer/types'
import { getRoutes } from '../getRoutes/getRoutes'
import { ErrorType } from '../SwapButton/constants'
import BigNumber from 'bignumber.js'

export function getInputError(swapState: SwapState, isInsufficientGas?: boolean): ErrorType | null {
	const { from, balance, isSufficientLiquidity } = swapState

	if (isInsufficientGas) {
		return ErrorType.LOW_GAS
	}

	if (from.amount) {
		if (!isSufficientLiquidity) {
			return ErrorType.NOT_SUFFICIENT_LIQUIDITY
		}

		if (balance && new BigNumber(from.amount).gt(balance.amount.formatted)) {
			return ErrorType.LOW_BALANCE
		}
	}

	return null
}
const clearTypingTimeout = (typingTimeoutRef: MutableRefObject<number | undefined>) => {
	if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
}

const setTypingTimeout = (
	swapState: SwapState,
	swapDispatch: Dispatch<SwapAction>,
	typingTimeoutRef: MutableRefObject<number | undefined>,
) => {
	const typingTimeoutId = setTimeout(async () => {
		const error = getInputError(swapState)

		swapDispatch({ type: SwapActionType.SET_INPUT_ERROR, payload: error })
		swapDispatch({ type: SwapActionType.SET_IS_SUFFICIENT_LIQUIDITY, payload: true })

		await getRoutes(swapState, swapDispatch)
	}, 700)

	typingTimeoutRef.current = typingTimeoutId as unknown as number
}

export const handleFetchRoutes = async (
	swapState: SwapState,
	swapDispatch: Dispatch<SwapAction>,
	typingTimeoutRef: MutableRefObject<number | undefined>,
) => {
	try {
		clearTypingTimeout(typingTimeoutRef)
		setTypingTimeout(swapState, swapDispatch, typingTimeoutRef)
	} catch (e) {
		console.error(e)
		swapDispatch({ type: SwapActionType.SET_LOADING, payload: false })
	}
}
