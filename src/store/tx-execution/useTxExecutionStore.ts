import { useContext } from 'react'
import { TxExecutionContext } from './TxExecutionContext'

export const useTxExecutionStore = () => {
	const useStore = useContext(TxExecutionContext)
	if (!useStore) {
		throw new Error('You forgot to wrap your component in <TxExecutionStoreProvider>.')
	}

	const steps = useStore(state => state.steps)
	const overallStatus = useStore(state => state.overallStatus)
	const executionTime = useStore(state => state.executionTime)
	const srcHash = useStore(state => state.srcHash)
	const dstHash = useStore(state => state.dstHash)
	const setSteps = useStore(state => state.setSteps)
	const setStepStatus = useStore(state => state.setStepStatus)
	const setStepHash = useStore(state => state.setStepHash)
	const setExecutionTime = useStore(state => state.setExecutionTime)
	const setSrcHash = useStore(state => state.setSrcHash)
	const setDstHash = useStore(state => state.setDstHash)
	const reset = useStore(state => state.reset)

	return {
		steps,
		overallStatus,
		executionTime,
		srcHash,
		dstHash,
		setSteps,
		setStepStatus,
		setStepHash,
		setExecutionTime,
		setSrcHash,
		setDstHash,
		reset,
	}
}
