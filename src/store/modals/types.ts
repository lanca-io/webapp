import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'
import type { ILancaChain } from '@lanca/sdk'

export type ModalsState = {
	isFromAssetModalOpen: boolean
	isToAssetModalOpen: boolean
	fromChain: ILancaChain | null
	toChain: ILancaChain | null
}

export type ModalActions = {
	openFromAssetModal: () => void
	closeFromAssetModal: () => void
	setFromChain: (chain: ILancaChain | null) => void
	openToAssetModal: () => void
	closeToAssetModal: () => void
	setToChain: (chain: ILancaChain | null) => void
}

export type ModalState = ModalsState & ModalActions
export type ModalStore = UseBoundStoreWithEqualityFn<StoreApi<ModalState>>
