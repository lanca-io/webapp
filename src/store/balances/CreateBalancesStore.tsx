import type { BalancesState } from './types'
import type { ExtendedToken } from '../tokens/types'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateBalancesStore = () =>
	createWithEqualityFn<BalancesState>(
		(set, get) => ({
			balances: [],
			isLoading: false,

			setBalances: (tokens: ExtendedToken[]) => set({ balances: tokens }),

			setIsLoading: (isLoading: boolean) => set({ isLoading }),

			getBalancesByChainId: (chainId: string) => {
				const { balances } = get()
				return balances.filter(token => token.chain_id === chainId)
			},
		}),
		Object.is,
	)
