import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand/vanilla'
import type { StepType } from '@lanca/sdk'
import type { Hash } from 'viem'
import { Status } from '@lanca/sdk'

export type StepExecution = {
	type: StepType
	status: Status
	txHash?: Hash
}

export interface TxExecutionState {
	steps: StepExecution[]
	overallStatus: Status
	executionTime: string
	srcHash: Hash | null
	dstHash: Hash | null
}

export interface TxExecutionActions {
	setSteps: (steps: StepType[]) => void
	setStepStatus: (index: number, status: Status) => void
	setStepHash: (index: number, hash: Hash) => void
	setExecutionTime: (time: string) => void
	setSrcHash: (hash: Hash) => void
	setDstHash: (hash: Hash) => void
	reset: () => void
}

export type TxExecutionStateAndActions = TxExecutionState & TxExecutionActions
export type TxExecutionStore = UseBoundStoreWithEqualityFn<StoreApi<TxExecutionStateAndActions>>

export const STATUS_PRIORITY = {
	[Status.REJECTED]: 0,
	[Status.FAILED]: 1,
	[Status.PENDING]: 2,
	[Status.SUCCESS]: 3,
	[Status.NOT_STARTED]: 4,
} as const
