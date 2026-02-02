import type {
	PoolAction,
	PoolActionPagination,
	PoolsPositionsState,
	PoolsPositionsStore,
} from './types'
import { createWithEqualityFn } from 'zustand/traditional'
import { formatUnits } from 'viem'

export const CreatePoolsPositionsStore = (): PoolsPositionsStore =>
	createWithEqualityFn<PoolsPositionsState>(set => ({
		rawUsd: null,
		rawLp: null,
		usd: null,
		lp: null,
		balancesLoading: false,

		actions: [],
		initialActionsLoading: true,
		dataActionsLoading: false,
		actionsPagination: { take: 20, skip: 0 },

		setBalances: (rawUsd: bigint, rawLp: bigint) => {
			set({
				rawUsd,
				rawLp,
				usd: rawUsd ? Number(formatUnits(rawUsd, 6)) : null,
				lp: rawLp ? Number(formatUnits(rawLp, 6)) : null,
			})
		},

		setBalancesLoading: (loading: boolean) => set({ balancesLoading: loading }),

		setActions: (actions: PoolAction[]) => set({ actions }),

		addActions: (actions: PoolAction[]) => {
			set(state => ({ actions: [...state.actions, ...actions] }))
		},

		setActionsLoading: (loading: boolean, initial = false) => {
			if (initial) {
				set({ initialActionsLoading: loading })
			} else {
				set({ dataActionsLoading: loading })
			}
		},

		setActionsPagination: (pagination: PoolActionPagination) =>
			set({ actionsPagination: pagination }),

		resetActions: () => {
			set({
				actions: [],
				initialActionsLoading: false,
				dataActionsLoading: false,
				actionsPagination: { take: 20, skip: 0 },
			})
		},
	}))
