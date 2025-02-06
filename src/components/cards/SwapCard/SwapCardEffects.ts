import { type Dispatch, type MutableRefObject, useContext, useEffect } from 'react'
import { clearRoutes } from './handlers/handleClearRoutes'
import { handleFetchRoutes } from './handlers/handleFetchRoutes'
import { type SwapAction, type SwapState } from './swapReducer/types'
import { setHistoryCard, setSwapCard } from './handlers/handleCardStates'
import { SelectionContext } from '../../../hooks/SelectionContext'
import { useAccount } from 'wagmi'
import { ErrorType } from './SwapButton/constants'
import { SwapActionType } from './swapReducer/types'
import { TokenAmounts } from '../../../utils/TokenAmounts'

interface UseSwapCardEffectsProps {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
	typingTimeoutRef: MutableRefObject<number | undefined>
}

export function useSwapCardEffects({ swapState, swapDispatch, typingTimeoutRef }: UseSwapCardEffectsProps) {
	const { address, connector } = useAccount()
	const { selectionDispatch } = useContext(SelectionContext)

	const { from, to, settings, selectedRoute, balance } = swapState

	useEffect(() => {
		setHistoryCard(selectionDispatch, from, to)
		setSwapCard(selectionDispatch, from, to)
	}, [from.token.address, to.token.address])

	useEffect(() => {
		clearRoutes(typingTimeoutRef, swapDispatch)

		void handleFetchRoutes(swapState, swapDispatch, typingTimeoutRef)

		return () => {
			clearRoutes(typingTimeoutRef, swapDispatch)
		}
	}, [from.token, from.amount, from.chain, to.token, to.chain, settings.allowSwitchChain, to.address, balance])

	useEffect(() => {
		if (!selectedRoute) return

		if (BigInt(selectedRoute.to.amount) <= 0n) {
			swapDispatch({ type: SwapActionType.SET_INPUT_ERROR, payload: ErrorType.AMOUNT_TOO_LOW })
		}

		const tokenAmounts = new TokenAmounts(selectedRoute.to.amount, selectedRoute.to.token.decimals)
		const parsedAmount = tokenAmounts.toParsedAmount()

		swapDispatch({
			type: SwapActionType.SET_AMOUNT,
			direction: 'to',
			payload: {
				amount: parsedAmount,
				amount_usd: selectedRoute.to.amount_usd,
			},
		})
	}, [selectedRoute])

	useEffect(() => {
		if (!connector) return
		const allowSwitchChain = connector.name !== 'WalletConnect'
		swapDispatch({ type: SwapActionType.SET_SETTINGS, payload: { allowSwitchChain } })
	}, [connector?.id])

	useEffect(() => {
		swapDispatch({ type: SwapActionType.SET_ADDRESS, direction: 'from', payload: address as string })
		swapDispatch({ type: SwapActionType.SET_ADDRESS, direction: 'to', payload: address as string })
	}, [address])
}
