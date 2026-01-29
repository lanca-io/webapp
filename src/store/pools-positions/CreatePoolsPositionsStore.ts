import type {
	PoolAction,
	PoolsPositionsStateAndActions,
	PoolsPositionsStore,
} from './types'
import { createWithEqualityFn } from 'zustand/traditional'
import { formatUnits } from 'viem'

export const CreatePoolsPositionsStore = (): PoolsPositionsStore =>
	createWithEqualityFn<PoolsPositionsStateAndActions>(set => ({
		rawUsd: null,
		rawLp: null,
		usd: null,
		lp: null,
		areBalancesLoading: false,
		actions: [],
		areActionsLoading: false,

		setBalances: (rawUsd: bigint, rawLp: bigint) => {
			set({
				rawUsd,
				rawLp,
				usd: rawUsd ? Number(formatUnits(rawUsd, 6)) : null,
				lp: rawLp ? Number(formatUnits(rawLp, 6)) : null,
			})
		},

		setBalancesLoading: (loading: boolean) =>
			set({ areBalancesLoading: loading }),

		setActions: (actions: PoolAction[]) => set({ actions }),

		setActionsLoading: (loading: boolean) =>
			set({ areActionsLoading: loading }),

		clearActions: () => set({ actions: [] }),
	}))
