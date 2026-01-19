import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand/vanilla'

export enum PoolActionType {
	DEPOSIT = 'DEPOSIT',
	WITHDRAWAL = 'WITHDRAWAL',
}

export enum PoolActionStage {
	IDLE = 'IDLE',
	ALLOWANCE = 'ALLOWANCE',
	QUEUE = 'QUEUE',
}

export enum PoolActionsStatus {
	IDLE = 'IDLE',
	PENDING = 'PENDING',
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
	REJECTED = 'REJECTED',
}

export type PoolActionStep = {
	stage: PoolActionStage
	status: PoolActionsStatus
}

export type PoolActionState = {
	type: PoolActionType | null
	currentStage: PoolActionStage
	overallStatus: PoolActionsStatus
	steps: PoolActionStep[]
}

export type PoolActionActions = {
	executeAction: (type: PoolActionType, steps: PoolActionStep[]) => void
	updateActionStep: (stage: PoolActionStage, status: PoolActionsStatus) => void
	reset: () => void
}

export type PoolActionExecutionStepAndActions = PoolActionState &
	PoolActionActions
export type PoolActionExecutionStore = UseBoundStoreWithEqualityFn<
	StoreApi<PoolActionExecutionStepAndActions>
>
