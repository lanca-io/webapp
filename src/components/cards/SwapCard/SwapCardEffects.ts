import { type Dispatch, type MutableRefObject, useContext, useEffect } from 'react'
import { getBalance } from '../../../utils/getBalance'
import { clearRoutes } from './handlers/handleRoutes'
import { handleFetchRoutes } from './handlers/handleFetchRoutes'
import { type SwapAction, type SwapState } from './swapReducer/types'
import { setHistoryCard } from './handlers/setHistoryCard'
import { setSwapCard } from './handlers/setSwapCard'
import { SelectionContext } from '../../../hooks/SelectionContext'
import { useAccount } from 'wagmi'
import { ErrorType } from './SwapButton/constants'

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

		if (Number(selectedRoute.to.amount) <= 0) {
			swapDispatch({ type: 'SET_INPUT_ERROR', payload: ErrorType.AMOUNT_TOO_LOW })
		}

		swapDispatch({
			type: 'SET_AMOUNT',
			direction: 'to',
			payload: {
				amount: selectedRoute.to.amount,
				amount_usd: selectedRoute.to.amount_usd,
			},
		})
	}, [selectedRoute])

	useEffect(() => {
		if (!connector) return
		const allowSwitchChain = connector.name !== 'WalletConnect'
		swapDispatch({ type: 'SET_SETTINGS', payload: { allowSwitchChain } })
	}, [connector?.id])

	useEffect(() => {
		swapDispatch({ type: 'SET_ADDRESS', direction: 'from', payload: address })
		swapDispatch({ type: 'SET_ADDRESS', direction: 'to', payload: address })
	}, [address])
}
