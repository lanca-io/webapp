import { type Dispatch, type MutableRefObject } from 'react'
import { type SwapAction, type SwapState } from '../swapReducer/types'
import { getRoutes } from '../getRoutes/getRoutes'

export const handleFetchRoutes = async (
	swapState: SwapState,
	swapDispatch: Dispatch<SwapAction>,
	typingTimeoutRef: MutableRefObject<number | undefined>,
) => {
	try {
		if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
		const typingTimeoutId = setTimeout(async () => {
			await getRoutes(swapState, swapDispatch)
		}, 700)
		typingTimeoutRef.current = typingTimeoutId
	} catch (e) {
		console.error(e)
		swapDispatch({ type: 'SET_LOADING', payload: false })
	}
}
