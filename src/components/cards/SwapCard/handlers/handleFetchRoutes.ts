import { type Dispatch, type MutableRefObject } from 'react'
import { type SwapAction, type SwapState } from '../swapReducer/types'
import { getRoutes } from '../getRoutes/getRoutes'
import { getPoolAmount } from './getPoolAmount'
import { ButtonType } from '../../../buttons/SwapButton/constants'
import { config } from '../../../../constants/config'

export const handleFetchRoutes = async (
	swapState: SwapState,
	swapDispatch: Dispatch<SwapAction>,
	typingTimeoutRef: MutableRefObject<number | undefined>,
) => {
	try {
		if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
		const typingTimeoutId = setTimeout(async () => {
			const { from, to, buttonState } = swapState

			const isBridge = from.chain.id !== to.chain.id
			const isWrongRangeAmount =
				buttonState.type === ButtonType.TESTNET_AMOUNT_TOO_HIGH ||
				buttonState.type === ButtonType.TESTNET_AMOUNT_TOO_LOW

			const isNativeToken = from.token.address === config.NULL_ADDRESS || to.token.address === config.NULL_ADDRESS

			swapDispatch({ type: 'SET_IS_SUFFICIENT_LIQUIDITY', payload: true })

			if (isWrongRangeAmount || isNativeToken) return

			if (isBridge) {
				const dstChainId = to.chain.id
				const poolAmount = await getPoolAmount(dstChainId)
				const fromAmountUsd = Number(from.amount) * from.token.priceUsd

				if (fromAmountUsd > Number(poolAmount)) {
					swapDispatch({ type: 'SET_IS_SUFFICIENT_LIQUIDITY', payload: false })
					return
				}
			}

			await getRoutes(swapState, swapDispatch)
		}, 700)
		typingTimeoutRef.current = typingTimeoutId
	} catch (e) {
		console.error(e)
		swapDispatch({ type: 'SET_LOADING', payload: false })
	}
}
