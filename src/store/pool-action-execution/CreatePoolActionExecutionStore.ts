import {
	PoolActionStage,
	PoolActionActions,
	PoolActionState,
	PoolActionType,
	PoolActionsStatus,
	PoolActionStep,
	PoolActionExecutionStepAndActions,
} from './types'
import { createWithEqualityFn } from 'zustand/traditional'

const initialState: Omit<PoolActionState, keyof PoolActionActions> = {
	type: null,
	currentStage: PoolActionStage.IDLE,
	overallStatus: PoolActionsStatus.IDLE,
	steps: [],
}

const computeOverallStatus = (steps: PoolActionStep[]): PoolActionsStatus => {
	if (!steps.length) return PoolActionsStatus.IDLE
	const statusOrder: PoolActionsStatus[] = [
		PoolActionsStatus.REJECTED,
		PoolActionsStatus.FAILED,
		PoolActionsStatus.PENDING,
		PoolActionsStatus.SUCCESS,
		PoolActionsStatus.IDLE,
	]

	for (const status of statusOrder) {
		if (steps.some(step => step.status === status)) {
			return status
		}
	}

	return PoolActionsStatus.IDLE
}

export const CreatePoolActionExecutionStore = () =>
	createWithEqualityFn<PoolActionExecutionStepAndActions>(
		set => ({
			...initialState,
			executeAction: (type: PoolActionType, steps: PoolActionStep[]) => {
				set({
					type,
					currentStage: PoolActionStage.ALLOWANCE,
					steps,
					overallStatus: PoolActionsStatus.PENDING,
				})
			},

			updateActionStep: (stage: PoolActionStage, status: PoolActionsStatus) => {
				set(state => {
					const steps = state.steps.map(s =>
						s.stage === stage ? { ...s, status } : s,
					)
					return {
						steps,
						overallStatus: computeOverallStatus(steps),
						currentStage:
							status === PoolActionsStatus.SUCCESS &&
							stage === PoolActionStage.ALLOWANCE
								? PoolActionStage.QUEUE
								: status === PoolActionsStatus.SUCCESS &&
									  stage === PoolActionStage.QUEUE
									? PoolActionStage.IDLE
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
