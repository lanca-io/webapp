import { type Dispatch, useContext, useEffect, useReducer } from 'react'
import { swapActions } from './swapActions'
import { swapInitialState } from './swapInitialState'
import { SwapActionType, type SwapAction, type SwapState } from './types'
import { SelectionContext } from '../../../../hooks/SelectionContext'
import { DataContext } from '../../../../hooks/DataContext/DataContext'

function swapReducer(state: SwapState, action: SwapAction): SwapState {
	const actionHandler = swapActions[action.type]
	if (actionHandler) return actionHandler(state, action)
	throw new Error(`Unknown action type: ${action.type}`)
}

export const useSwapReducer = (): [SwapState, Dispatch<SwapAction>] => {
	const { selection } = useContext(SelectionContext) ?? {
		selection: { swapCard: { from: { chain: {}, token: {} }, to: { chain: {}, token: {} } } },
	}
	const { tokens } = useContext(DataContext)
	const [state, dispatch] = useReducer(swapReducer, swapInitialState(selection))

	useEffect(() => {
		if (
			state.from.token.priceUsd === null &&
			state.from.chain.id === '10' &&
			state.to.chain.id === '137' &&
			state.to.token.priceUsd === null &&
			tokens['10'] &&
			tokens['137']
		) {
			dispatch({
				type: SwapActionType.SET_TOKEN,
				payload: {
					token: {
						...tokens['10'][0],
						chainId: '10',
						logoURL: tokens['10'][0].logoURI,
						address: `0x${tokens['10'][0].address}`,
						priceUsd: tokens['10'][0].priceUsd ?? 0,
					},
				},
				direction: 'from',
			})
			dispatch({
				type: SwapActionType.SET_TOKEN,
				payload: {
					token: {
						...tokens['137'][0],
						chainId: '137',
						logoURL: tokens['137'][0].logoURI,
						address: `0x${tokens['137'][0].address}`,
						priceUsd: tokens['137'][0].priceUsd ?? 0,
					},
				},
				direction: 'to',
			})
		}
	}, [tokens])

	return [state, dispatch]
}
