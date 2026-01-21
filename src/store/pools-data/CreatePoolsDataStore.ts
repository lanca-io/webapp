import type { PoolsDataState, PoolsDataActions, PoolsStore } from './types'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreatePoolsDataStore = (): PoolsStore =>
	createWithEqualityFn<PoolsDataState & PoolsDataActions>((set, get) => {
		const computeLpPrice = () => {
			const { supply, tvl } = get()
			set({ lpPrice: (tvl ?? 0) / (supply ?? 1) || null })
		}

		return {
			supply: null,
			cap: null,
			tvl: null,
			lpPrice: null,
			isLoading: false,

			setMetics: (supply: number, cap: number, tvl: number) => {
				set({ supply, cap, tvl })
				computeLpPrice()
			},

			setIsLoading: (isLoading: boolean) => set({ isLoading }),
		}
	})
