import type { ModalState } from './types'
import { createWithEqualityFn } from 'zustand/traditional'
import { ConceroChain } from '../chains/types'

export const CreateModalsStore = () =>
	createWithEqualityFn<ModalState>(
		set => ({
			isFromAssetModalOpen: false,
			isToAssetModalOpen: false,
			fromChain: null,
			toChain: null,
			openFromAssetModal: () => set({ isFromAssetModalOpen: true }),
			closeFromAssetModal: () => set({ isFromAssetModalOpen: false, fromChain: null }),
			setFromChain: (chain: ConceroChain | null) => set({ fromChain: chain }),
			openToAssetModal: () => set({ isToAssetModalOpen: true }),
			closeToAssetModal: () => set({ isToAssetModalOpen: false, toChain: null }),
			setToChain: (chain: ConceroChain | null) => set({ toChain: chain }),
		}),
		Object.is,
	)
