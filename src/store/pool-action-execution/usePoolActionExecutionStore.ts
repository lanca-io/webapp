import { useContext } from 'react'
import { PoolActionExecutionContext } from './PoolActionExecutionContext'
export const usePoolActionExecutionStore = () => {
	const useStore = useContext(PoolActionExecutionContext)
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
