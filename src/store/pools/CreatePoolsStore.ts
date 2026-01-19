import type { PoolsState, PoolsActions, PoolsStore } from './types'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreatePoolsStore = (): PoolsStore =>
	createWithEqualityFn<PoolsState & PoolsActions>((set, get) => {
		const computeUSDBalance = () => {
			const state = get()
			if (state.balance && state.tvl && state.supply) {
				const usdBalance =
					((state.balance * state.tvl * 1n) << 12n) / state.supply
				set({ usdBalance })
			}
		}

		return {
			supply: null,
			cap: null,
			tvl: null,
			balance: null,
			usdBalance: null,
			principal: null,
			isSupplyLoading: false,
			isCapLoading: false,
			isTvlLoading: false,
			isBalanceLoading: false,
			setSupply: (supply: bigint) => {
				set({ supply })
				computeUSDBalance()
			},
			setCap: (cap: bigint) => set({ cap }),
			setTvl: (tvl: bigint) => {
				set({ tvl })
				computeUSDBalance()
			},
			setBalance: (balance: bigint) => {
				set({ balance })
				computeUSDBalance()
			},
			setPrincipal: (principal: bigint) => set({ principal }),
			setIsSupplyLoading: isLoading => set({ isSupplyLoading: isLoading }),
			setIsCapLoading: isLoading => set({ isCapLoading: isLoading }),
			setIsTvlLoading: isLoading => set({ isTvlLoading: isLoading }),
			setIsBalanceLoading: isLoading => set({ isBalanceLoading: isLoading }),
		}
	}, Object.is)
