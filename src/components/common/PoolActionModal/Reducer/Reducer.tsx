import {
	PoolsActionState,
	PoolsActionAction,
	PoolsStateActions,
	PoolsActionStatus,
	PoolsActionType,
	PoolsActionStages,
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
		case PoolsStateActions.UPDATE_STEP:
			const { stage, status } = action.payload!
			return stage === PoolsActionStages.ALLOWANCE
				? { ...state, allowance: status }
				: { ...state, queue: status }

		case PoolsStateActions.CHANGE_TYPE:
			return createInitialState(action.payload)

		case PoolsStateActions.RESET:
			return createInitialState(state.type)

		default:
			return state
	}
}
