import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand/vanilla'

export enum PoolsExecutionType {
	DEPOSIT = 'DEPOSIT',
	WITHDRAWAL = 'WITHDRAWAL',
}

export enum PoolsExecutionStage {
	IDLE = 'IDLE',
	ALLOWANCE = 'ALLOWANCE',
	QUEUE = 'QUEUE',
}

export enum PoolsExecutionStatus {
	IDLE = 'IDLE',
	PENDING = 'PENDING',
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
	REJECTED = 'REJECTED',
}

export type PoolsExecutionStep = {
	stage: PoolsExecutionStage
	status: PoolsExecutionStatus
}

export type PoolsExecutionState = {
	type: PoolsExecutionType | null
	currentStage: PoolsExecutionStage
	overallStatus: PoolsExecutionStatus
	steps: PoolsExecutionStep[]
}

export type PoolsExecutionActions = {
	executeAction: (type: PoolsExecutionType, steps: PoolsExecutionStep[]) => void
	updateActionStep: (
		stage: PoolsExecutionStage,
		status: PoolsExecutionStatus,
	) => void
	reset: () => void
}

export type PoolsExecutionStateAndActions = PoolsExecutionState &
	PoolsExecutionActions
export type PoolsExecutionStore = UseBoundStoreWithEqualityFn<
	StoreApi<PoolsExecutionStateAndActions>
>
