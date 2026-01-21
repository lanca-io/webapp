import {
	PoolsExecutionStage,
	PoolsExecutionActions,
	PoolsExecutionState,
	PoolsExecutionType,
	PoolsExecutionStatus,
	PoolsExecutionStep,
	PoolsExecutionStateAndActions,
} from './types'
import { createWithEqualityFn } from 'zustand/traditional'

const initialState: Omit<PoolsExecutionState, keyof PoolsExecutionActions> = {
	type: null,
	currentStage: PoolsExecutionStage.IDLE,
	overallStatus: PoolsExecutionStatus.IDLE,
	steps: [],
}

const computeOverallStatus = (
	steps: PoolsExecutionStep[],
): PoolsExecutionStatus => {
	if (!steps.length) return PoolsExecutionStatus.IDLE
	const statusOrder: PoolsExecutionStatus[] = [
		PoolsExecutionStatus.REJECTED,
		PoolsExecutionStatus.FAILED,
		PoolsExecutionStatus.PENDING,
		PoolsExecutionStatus.SUCCESS,
		PoolsExecutionStatus.IDLE,
	]

	for (const status of statusOrder) {
		if (steps.some(step => step.status === status)) {
			return status
		}
	}

	return PoolsExecutionStatus.IDLE
}

export const CreatePoolsExecutionStore = () =>
	createWithEqualityFn<PoolsExecutionStateAndActions>(
		set => ({
			...initialState,
			executeAction: (
				type: PoolsExecutionType,
				steps: PoolsExecutionStep[],
			) => {
				set({
					type,
					currentStage: PoolsExecutionStage.ALLOWANCE,
					steps,
					overallStatus: PoolsExecutionStatus.PENDING,
				})
			},

			updateActionStep: (
				stage: PoolsExecutionStage,
				status: PoolsExecutionStatus,
			) => {
				set(state => {
					const steps = state.steps.map(s =>
						s.stage === stage ? { ...s, status } : s,
					)
					return {
						steps,
						overallStatus: computeOverallStatus(steps),
						currentStage:
							status === PoolsExecutionStatus.SUCCESS &&
							stage === PoolsExecutionStage.ALLOWANCE
								? PoolsExecutionStage.QUEUE
								: status === PoolsExecutionStatus.SUCCESS &&
									  stage === PoolsExecutionStage.QUEUE
									? PoolsExecutionStage.IDLE
									: state.currentStage,
					}
				})
			},

			reset: () => {
				set(initialState)
			},
		}),
		Object.is,
	)
