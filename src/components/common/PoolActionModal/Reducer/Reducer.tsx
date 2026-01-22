import {
	PoolsActionState,
	PoolsActionAction,
	PoolsStateActions,
	PoolsActionStatus,
	PoolsActionType,
} from './types'

export const initialState: PoolsActionState = {
	type: PoolsActionType.DEPOSIT,
	allowance: PoolsActionStatus.IDLE,
	queue: PoolsActionStatus.IDLE,
}

export const createInitialState = (
	type: PoolsActionType,
): PoolsActionState => ({
	...initialState,
	type,
})

export const PoolsActionReducer = (
	state: PoolsActionState = initialState,
	action: PoolsActionAction,
): PoolsActionState => {
	switch (action.type) {
		case PoolsStateActions.SET_ALLOWANCE:
			return {
				...state,
				allowance: action.payload,
			}

		case PoolsStateActions.SET_QUEUE:
			return {
				...state,
				queue: action.payload,
			}

		case PoolsStateActions.RESET:
			return initialState

		default:
			return state
	}
}
