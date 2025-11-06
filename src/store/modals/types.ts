import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'
import type { ConceroChain } from '../chains/types'

export type ModalsState = {
	isFromAssetModalOpen: boolean
	isToAssetModalOpen: boolean
	fromChain: ConceroChain | null
	toChain: ConceroChain | null
}

export type ModalActions = {
	openFromAssetModal: () => void
	closeFromAssetModal: () => void
	setFromChain: (chain: ConceroChain | null) => void
	openToAssetModal: () => void
	closeToAssetModal: () => void
	setToChain: (chain: ConceroChain | null) => void
}

export type ModalState = ModalsState & ModalActions
export type ModalStore = UseBoundStoreWithEqualityFn<StoreApi<ModalState>>
