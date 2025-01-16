import { type Dispatch, useReducer } from 'react'
import { poolActions } from './poolActions'
import { poolInitialState } from './initialState'
import { type PoolAction, type PoolState } from './types'

function swapReducer(state: PoolState, action: PoolAction): PoolState {
	const actionHandler = poolActions[action.type]
	if (actionHandler) return actionHandler(state, action)
	throw new Error(`Unknown action type: ${action.type}`)
}

export const useSwapReducer = (): [PoolState, Dispatch<PoolAction>] => {
	return useReducer(swapReducer, poolInitialState())
}
