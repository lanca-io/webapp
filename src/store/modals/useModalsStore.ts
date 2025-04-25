import { useContext } from 'react'
import { ModalsContext } from './ModalsContext'

export const useModalsStore = () => {
	const useStore = useContext(ModalsContext)
	if (!useStore) {
		throw new Error(`You forgot to wrap your component in <ModalsStoreProvider>.`)
	}

	const isFromAssetModalOpen = useStore(state => state.isFromAssetModalOpen)
	const isToAssetModalOpen = useStore(state => state.isToAssetModalOpen)
	const fromChain = useStore(state => state.fromChain)
	const toChain = useStore(state => state.toChain)
	const openFromAssetModal = useStore(state => state.openFromAssetModal)
	const closeFromAssetModal = useStore(state => state.closeFromAssetModal)
	const setFromChain = useStore(state => state.setFromChain)
	const openToAssetModal = useStore(state => state.openToAssetModal)
	const closeToAssetModal = useStore(state => state.closeToAssetModal)
	const setToChain = useStore(state => state.setToChain)

	return {
		isFromAssetModalOpen,
		isToAssetModalOpen,
		fromChain,
		toChain,
		openFromAssetModal,
		closeFromAssetModal,
		setFromChain,
		openToAssetModal,
		closeToAssetModal,
		setToChain,
	}
}
