import type {
	PoolsUserBalanceStateAndActions,
	PoolsUserBalanceStore,
} from './types'
import { createWithEqualityFn } from 'zustand/traditional'
import { formatUnits } from 'viem'

export const CreatePoolsUserBalanceStore = (): PoolsUserBalanceStore =>
	createWithEqualityFn<PoolsUserBalanceStateAndActions>(set => ({
		rawUsd: null,
		rawLp: null,
		usd: null,
		lp: null,
		isLoading: false,

		setBalances: (rawUsd: bigint, rawLp: bigint) => {
			set({
				rawUsd,
				rawLp,
				usd: rawUsd ? Number(formatUnits(rawUsd, 6)) : null,
				lp: rawLp ? Number(formatUnits(rawLp, 6)) : null,
			})
		},

		setIsLoading: (isLoading: boolean) => set({ isLoading }),
	}))
