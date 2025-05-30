import { useContext } from 'react'
import { SubvariantContext } from './SubvariantContext'

export const useSubvariantStore = () => {
	const useStore = useContext(SubvariantContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <SubvariantStoreProvider>.`)
	}

	const state = useStore(state => state.state)
	const setState = useStore(state => state.setState)

	return {
		state,
		setState,
	}
}
