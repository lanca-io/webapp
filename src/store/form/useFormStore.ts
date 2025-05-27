import { useContext } from 'react'
import { FormContext } from './FormContext'

export const useFormStore = () => {
	const useStore = useContext(FormContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <FormStoreProvider>.`)
	}

	const fromChain = useStore(state => state.fromChain)
	const toChain = useStore(state => state.toChain)
	const fromToken = useStore(state => state.fromToken)
	const toToken = useStore(state => state.toToken)
	const fromAmount = useStore(state => state.fromAmount)
	const toAddress = useStore(state => state.toAddress)
	const amountInput = useStore(state => state.amountInput)
	const amountInputError = useStore(state => state.amountInputError)
	const amountInputMode = useStore(state => state.amountInputMode)
	const amountInputFocused = useStore(state => state.amountInputFocused)
	const addressInput = useStore(state => state.addressInput)
	const addressInputError = useStore(state => state.addressInputError)
	const addressInputMode = useStore(state => state.addressInputMode)
	const addressInputFocused = useStore(state => state.addressInputFocused)
	const slippageInput = useStore(state => state.slippageInput)
	const slippageInputError = useStore(state => state.slippageInputError)
	const slippageInputMode = useStore(state => state.slippageInputMode)
	const slippageInputFocused = useStore(state => state.slippageInputFocused)
	const setFromChain = useStore(state => state.setFromChain)
	const setToChain = useStore(state => state.setToChain)
	const setFromToken = useStore(state => state.setFromToken)
	const setToToken = useStore(state => state.setToToken)
	const setFromAmount = useStore(state => state.setFromAmount)
	const setToAddress = useStore(state => state.setToAddress)
	const setAmountInput = useStore(state => state.setAmountInput)
	const setAmountInputError = useStore(state => state.setAmountInputError)
	const setAmountInputMode = useStore(state => state.setAmountInputMode)
	const setAmountInputFocused = useStore(state => state.setAmountInputFocused)
	const setAddressInput = useStore(state => state.setAddressInput)
	const setAddressInputError = useStore(state => state.setAddressInputError)
	const setAddressInputMode = useStore(state => state.setAddressInputMode)
	const setAddressInputFocused = useStore(state => state.setAddressInputFocused)
	const setSlippageInput = useStore(state => state.setSlippageInput)
	const setSlippageInputError = useStore(state => state.setSlippageInputError)
	const setSlippageMode = useStore(state => state.setSlippageMode)
	const setSlippageInputFocused = useStore(state => state.setSlippageInputFocused)
	const clearInputs = useStore(state => state.clearInputs)
	const swap = useStore(state => state.swap)

	return {
		fromChain,
		toChain,
		fromToken,
		toToken,
		fromAmount,
		toAddress,
		amountInput,
		amountInputError,
		amountInputMode,
		amountInputFocused,
		addressInput,
		addressInputError,
		addressInputMode,
		addressInputFocused,
		slippageInput,
		slippageInputError,
		slippageInputMode,
		slippageInputFocused,
		setFromChain,
		setToChain,
		setFromToken,
		setToToken,
		setFromAmount,
		setToAddress,
		setAmountInput,
		setAmountInputError,
		setAmountInputMode,
		setAmountInputFocused,
		setAddressInput,
		setAddressInputError,
		setAddressInputMode,
		setAddressInputFocused,
		setSlippageInput,
		setSlippageInputError,
		setSlippageMode,
		setSlippageInputFocused,
		clearInputs,
		swap,
	}
}
