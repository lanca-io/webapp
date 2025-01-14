import { type Dispatch } from 'react'
import { type ConceroToken, type ConceroChain } from 'lanca-sdk-demo'

export interface Direction {
	token: ConceroToken
	chain: ConceroChain
}

export const setHistoryCard = (dispatch: Dispatch<any>, from: Direction, to: Direction): void => {
	dispatch({
		type: 'SET_HISTORY_CARD',
		payload: {
			from: {
				chainId: from.chain.id,
				token: from.token,
			},
			to: {
				chainId: to.chain.id,
				token: to.token,
			},
		},
	})
}

export const setSwapCard = (dispatch: Dispatch<any>, from: Direction, to: Direction) => {
	dispatch({
		type: 'SET_SWAP_CARD',
		payload: {
			from: {
				chain: from.chain,
				token: from.token,
			},
			to: {
				chain: to.chain,
				token: to.token,
			},
		},
	})
}
