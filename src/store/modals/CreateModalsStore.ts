import type { ModalState } from './types'
import type { ILancaChain } from '@lanca/sdk'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateModalsStore = () =>
	createWithEqualityFn<ModalState>(
		set => ({
			isFromAssetModalOpen: false,
			isToAssetModalOpen: false,
			fromChain: null,
			toChain: null,
			openFromAssetModal: () => set({ isFromAssetModalOpen: true }),
			closeFromAssetModal: () => set({ isFromAssetModalOpen: false, fromChain: null }),
			setFromChain: (chain: ILancaChain | null) => set({ fromChain: chain }),
			openToAssetModal: () => set({ isToAssetModalOpen: true }),
			closeToAssetModal: () => set({ isToAssetModalOpen: false, toChain: null }),
			setToChain: (chain: ILancaChain | null) => set({ toChain: chain }),
		}),
		Object.is,
	)
