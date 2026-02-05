export enum PoolsActionType {
	Deposit = 'deposit',
	Withdraw = 'withdraw',
}

export enum PoolsActionStages {
	Allowance = 'allowance',
	Queue = 'Queue',
}

export enum PoolsActionStatus {
	Idle = 'Idle',
	Pending = 'Pending',
	Success = 'Success',
	Failed = 'Failed',
	Rejected = 'Rejected',
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
