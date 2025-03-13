import type { BalancesState } from './types'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateBalancesStore = () =>
	createWithEqualityFn<BalancesState>(
		set => ({
			srcBalances: [],
			dstBalances: [],
			isLoadingSrcBalances: false,
			isLoadingDstBalances: false,
			setSrcBalances: balances => set({ srcBalances: balances }),
			setDstBalances: balances => set({ dstBalances: balances }),
			clearSrcBalances: () => set({ srcBalances: [] }),
			clearDstBalances: () => set({ dstBalances: [] }),
			setLoadingSrcBalances: isLoading => set({ isLoadingSrcBalances: isLoading }),
			setLoadingDstBalances: isLoading => set({ isLoadingDstBalances: isLoading }),
		}),
		Object.is,
	)
