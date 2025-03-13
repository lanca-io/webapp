import type { BalancesState } from './types'
import { createWithEqualityFn } from 'zustand/traditional'
import type { ExtendedToken } from '../../store/tokens/types'

export const CreateBalancesStore = () =>
	createWithEqualityFn<BalancesState>(
		(set, get) => ({
			balances: [],
			isLoadingBalances: false,
			setBalances: (tokens: ExtendedToken[]) => set({ balances: tokens }),
			setLoadingBalances: (isLoading: boolean) => set({ isLoadingBalances: isLoading }),
			filterTokensByChain: (chainId: string) => {
				const { balances } = get()
				return balances.filter(token => token.chain_id === chainId)
			},
		}),
		Object.is,
	)
