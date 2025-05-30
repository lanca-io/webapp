import type { StepExecution } from './types'
import type { TxExecutionStateAndActions } from './types'
import type { Hash } from 'viem'
import type { IRouteType } from '@lanca/sdk'
import { createWithEqualityFn } from 'zustand/traditional'
import { Status, StepType } from '@lanca/sdk'
import { zeroAddress } from 'viem'
import { STATUS_PRIORITY } from './types'

const initialState: Omit<
	TxExecutionStateAndActions,
	| 'setSteps'
	| 'setStepStatus'
	| 'setStepHash'
	| 'setExecutionTime'
	| 'setSrcHash'
	| 'setDstHash'
	| 'reset'
	| 'deriveStepsFromRoute'
> = {
	steps: [],
	overallStatus: Status.NOT_STARTED,
	executionTime: '',
	srcHash: null,
	dstHash: null,
}

const computeOverallStatus = (steps: StepExecution[]): Status => {
	if (!steps.length) return Status.NOT_STARTED
	const priorities = steps.map(s => STATUS_PRIORITY[s.status])
	const minPriority = Math.min(...priorities)
	return Object.entries(STATUS_PRIORITY).find(([_, value]) => value === minPriority)?.[0] as Status
}

const arraysEqual = (a: StepType[], b: StepType[]) => a.length === b.length && a.every((val, i) => val === b[i])

export const CreateTxExecutionStore = () =>
	createWithEqualityFn<TxExecutionStateAndActions>(
		(set, get) => ({
			...initialState,

			deriveStepsFromRoute: (route: IRouteType | null) => {
				if (!route) {
					set({ steps: [], overallStatus: Status.NOT_STARTED })
					return
				}

				const needsAllowance = route.from.token?.address !== zeroAddress
				const baseSteps = route.steps.map(step => ({
					type: step.type,
					status: Status.NOT_STARTED,
				}))

				const stepsWithAllowance = needsAllowance
					? [
							{
								type: StepType.ALLOWANCE,
								status: Status.NOT_STARTED,
							},
							...baseSteps,
						]
					: baseSteps

				if (
					!arraysEqual(
						get().steps.map(s => s.type),
						stepsWithAllowance.map(s => s.type),
					)
				) {
					set({
						steps: stepsWithAllowance,
						overallStatus: computeOverallStatus(stepsWithAllowance),
					})
				}
			},

			setSteps: stepTypes => {
				set({
					steps: stepTypes.map(type => ({ type, status: Status.NOT_STARTED })),
					overallStatus: Status.NOT_STARTED,
				})
			},

			setStepStatus: (type, status) => {
				set(state => {
					const steps = state.steps.map(s => (s.type === type ? { ...s, status } : s))
					return {
						steps,
						overallStatus: computeOverallStatus(steps),
					}
				})
			},

			setStepHash: (index, hash) => {
				set(state => ({
					steps: state.steps.map((s, i) => (i === index ? { ...s, txHash: hash } : s)),
				}))
			},

			setExecutionTime: time => {
				set({ executionTime: time })
			},

			setSrcHash: (hash: Hash) => {
				set({ srcHash: hash })
			},

			setDstHash: (hash: Hash) => {
				set({ dstHash: hash })
			},

			reset: () => {
				set(initialState)
			},
		}),
		Object.is,
	)
