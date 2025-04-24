import { useContext } from 'react'
import { FormContext } from './FormContext'

export const useFormStore = () => {
	const useStore = useContext(FormContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <FormStoreProvider>.`)
	}

	const sourceChain = useStore(state => state.sourceChain)
	const destinationChain = useStore(state => state.destinationChain)
	const sourceToken = useStore(state => state.sourceToken)
	const destinationToken = useStore(state => state.destinationToken)
	const amount = useStore(state => state.amount)
	const setSourceChain = useStore(state => state.setSourceChain)
	const setDestinationChain = useStore(state => state.setDestinationChain)
	const setSourceToken = useStore(state => state.setSourceToken)
	const setDestinationToken = useStore(state => state.setDestinationToken)
	const setAmount = useStore(state => state.setAmount)
	const clearAmount = useStore(state => state.clearAmount)
	const swapChainsAndTokens = useStore(state => state.swapChainsAndTokens)

	return {
		sourceChain,
		destinationChain,
		sourceToken,
		destinationToken,
		amount,
		setSourceChain,
		setDestinationChain,
		setSourceToken,
		setDestinationToken,
		setAmount,
		clearAmount,
		swapChainsAndTokens,
	}
}
