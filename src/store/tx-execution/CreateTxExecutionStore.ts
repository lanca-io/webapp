import type { TxExecutionStateAndActions } from './types'
import type { Hash } from 'viem'
import { createWithEqualityFn } from 'zustand/traditional'
import { Status } from '@lanca/sdk'
import { STATUS_PRIORITY } from './types'

const initialState: Omit<
	TxExecutionStateAndActions,
	'setSteps' | 'setStepStatus' | 'setStepHash' | 'setExecutionTime' | 'setSrcHash' | 'setDstHash' | 'reset'
> = {
	steps: [],
	overallStatus: Status.NOT_STARTED,
	executionTime: '',
	srcHash: null,
	dstHash: null,
}

const computeOverallStatus = (steps: TxExecutionStateAndActions['steps']): Status => {
	if (!steps.length) return Status.NOT_STARTED
	const priorities = steps.map(s => STATUS_PRIORITY[s.status])
	const minPriority = Math.min(...priorities)
	return Object.entries(STATUS_PRIORITY).find(([_, value]) => value === minPriority)?.[0] as Status
}

export const CreateTxExecutionStore = () =>
	createWithEqualityFn<TxExecutionStateAndActions>(
		set => ({
			...initialState,

			setSteps: stepTypes => {
				set({
					steps: stepTypes.map(type => ({ type, status: Status.NOT_STARTED })),
					overallStatus: Status.NOT_STARTED,
				})
			},

			setStepStatus: (index, status) => {
				set(state => {
					const steps = state.steps.map((s, i) => (i === index ? { ...s, status } : s))
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
