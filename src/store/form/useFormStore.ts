import { useContext } from 'react'
import { FormContext } from './FormContext'

export const useFormStore = () => {
	const useStore = useContext(FormContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <FormStoreProvider>.`)
	}

	const srcChain = useStore(state => state.srcChain)
	const dstChain = useStore(state => state.dstChain)
	const srcToken = useStore(state => state.srcToken)
	const dstToken = useStore(state => state.dstToken)
	const amount = useStore(state => state.amount)
	const setSrcChain = useStore(state => state.setSrcChain)
	const setDstChain = useStore(state => state.setDstChain)
	const setSrcToken = useStore(state => state.setSrcToken)
	const setDstToken = useStore(state => state.setDstToken)
	const setAmount = useStore(state => state.setAmount)
	const swapChainsAndTokens = useStore(state => state.swapChainsAndTokens)

	return {
		srcChain,
		dstChain,
		srcToken,
		dstToken,
		amount,
		setSrcChain,
		setDstChain,
		setSrcToken,
		setDstToken,
		setAmount,
		swapChainsAndTokens,
	}
}
