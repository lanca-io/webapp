import { useContext } from 'react'
import { PoolsExecutionContext } from './PoolsExecutionContext'

export const usePoolsExecutionStore = () => {
	const useStore = useContext(PoolsExecutionContext)
	if (!useStore) {
		throw new Error(
			`You forgot to wrap your component in <RoutesStoreProvider>.`,
		)
	}

	const type = useStore(state => state.type)
	const currentStage = useStore(state => state.currentStage)
	const overallStatus = useStore(state => state.overallStatus)
	const steps = useStore(state => state.steps)
	const executeAction = useStore(state => state.executeAction)
	const updateActionStep = useStore(state => state.updateActionStep)
	const reset = useStore(state => state.reset)

	return {
		type,
		currentStage,
		overallStatus,
		steps,
		executeAction,
		updateActionStep,
		reset,
	}
}
