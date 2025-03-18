import { useContext } from 'react'
import { SplitSubvariantStoreContext } from './SplitSubvariantContext'

export const useSplitSubvariantStore = () => {
	const useStore = useContext(SplitSubvariantStoreContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <SplitSubvariantStoreProvider>.`)
	}

	const state = useStore(state => state.state)
	const setState = useStore(state => state.setState)

	return {
		state,
		setState,
	}
}
