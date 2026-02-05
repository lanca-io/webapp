import type { PoolsDataState, PoolsDataActions, PoolsStore } from './types'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreatePoolsDataStore = (): PoolsStore =>
	createWithEqualityFn<PoolsDataState & PoolsDataActions>((set, get) => {
		const computeLpPrice = () => {
			const { lp_supply, tvl } = get()
			set({ lpPrice: (tvl ?? 0) / (lp_supply ?? 1) || null })
		}

		return {
			lp_supply: null,
			cap: null,
			tvl: null,
			minDeposit: null,
			minWithdrawal: null,
			lpPrice: null,
			isLoading: false,

			setMetics: (
				lp_supply: number,
				cap: number,
				tvl: number,
				minDeposit: number,
				minWithdrawal: number,
			) => {
				set({ lp_supply, cap, tvl, minDeposit, minWithdrawal })
				computeLpPrice()
			},

			setIsLoading: (isLoading: boolean) => set({ isLoading }),
		}
	})
