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
	const error = useStore(state => state.error)
	const inputValue = useStore(state => state.inputValue)
	const inputMode = useStore(state => state.inputMode)
	const amount = useStore(state => state.amount)

	const setSourceChain = useStore(state => state.setSourceChain)
	const setDestinationChain = useStore(state => state.setDestinationChain)
	const setSourceToken = useStore(state => state.setSourceToken)
	const setDestinationToken = useStore(state => state.setDestinationToken)
	const swapChainsAndTokens = useStore(state => state.swapChainsAndTokens)
	const setError = useStore(state => state.setError)
	const setInputValue = useStore(state => state.setInputValue)
	const setInputMode = useStore(state => state.setInputMode)
	const setAmount = useStore(state => state.setAmount)
	const clearInput = useStore(state => state.clearInput)

	return {
		sourceChain,
		destinationChain,
		sourceToken,
		destinationToken,
		error,
		inputValue,
		inputMode,
		amount,
		setSourceChain,
		setDestinationChain,
		setSourceToken,
		setDestinationToken,
		swapChainsAndTokens,
		setError,
		setInputValue,
		setInputMode,
		setAmount,
		clearInput,
	}
}
