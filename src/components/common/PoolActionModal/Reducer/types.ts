export enum PoolsActionType {
	DEPOSIT = 'DEPOSIT',
	WITHDRAWAL = 'WITHDRAWAL',
}

export enum PoolsActionStages {
	ALLOWANCE = 'ALLOWANCE',
	QUEUE = 'QUEUE',
}

export enum PoolsActionStatus {
	IDLE = 'IDLE',
	PENDING = 'PENDING',
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
	REJECTED = 'REJECTED',
}

export enum PoolsStateActions {
	CHANGE_TYPE = 'CHANGE_TYPE',
	UPDATE_STEP = 'UPDATE_STEP',
	RESET = 'RESET',
}

export type PoolsActionState = {
	type: PoolsActionType
	allowance: PoolsActionStatus
	queue: PoolsActionStatus
}

export type PoolsActionAction =
	| {
			type: PoolsStateActions.UPDATE_STEP
			payload: {
				stage: PoolsActionStages
				status: PoolsActionStatus
			}
	  }
	| { type: PoolsStateActions.RESET }
	| { type: PoolsStateActions.CHANGE_TYPE; payload: PoolsActionType }

export type PoolsActionContextValue = {
	state: PoolsActionState
	dispatch: React.Dispatch<PoolsActionAction>
}
