import type { TokensState, ExtendedToken } from './types'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateTokensStore = () =>
	createWithEqualityFn<TokensState>(
		set => ({
			srcTokens: [],
			srcTokensLoading: false,
			srcSearchValue: '',
			srcOffset: 0,
			setSrcTokens: (tokens: ExtendedToken[] | []) => set({ srcTokens: tokens }),
			setSrcTokensLoading: (isLoading: boolean) => set({ srcTokensLoading: isLoading }),
			setSrcSearchValue: (searchValue: string) => set({ srcSearchValue: searchValue }),
			setSrcOffset: (offset: number) => set({ srcOffset: offset }),
			clearSrcTokens: () => set({ srcTokens: [] }),

			dstTokens: [],
			dstTokensLoading: false,
			dstSearchValue: '',
			dstOffset: 0,
			setDstTokens: (tokens: ExtendedToken[] | []) => set({ dstTokens: tokens }),
			setDstTokensLoading: (isLoading: boolean) => set({ dstTokensLoading: isLoading }),
			setDstSearchValue: (searchValue: string) => set({ dstSearchValue: searchValue }),
			setDstOffset: (offset: number) => set({ dstOffset: offset }),
			clearDstTokens: () => set({ dstTokens: [] }),
		}),
		Object.is,
	)
