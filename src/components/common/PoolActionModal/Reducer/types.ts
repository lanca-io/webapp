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
	EXECUTE = 'EXECUTE',
	SET_ALLOWANCE = 'SET_ALLOWANCE',
	SET_QUEUE = 'SET_QUEUE',
	RESET = 'RESET',
}

export type PoolsActionState = {
	type: PoolsActionType
	allowance: PoolsActionStatus
	queue: PoolsActionStatus
}

export type PoolsActionAction =
	| { type: PoolsStateActions.SET_ALLOWANCE; payload: PoolsActionStatus }
	| { type: PoolsStateActions.SET_QUEUE; payload: PoolsActionStatus }
	| { type: PoolsStateActions.RESET }

export type PoolsActionContextValue = {
	state: PoolsActionState
	dispatch: React.Dispatch<PoolsActionAction>
}
