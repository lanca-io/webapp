import type { TokensState, ExtendedToken } from './types'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateTokensStore = () =>
	createWithEqualityFn<TokensState>(
		set => ({
			srcTokens: [],
			srcSearchedTokens: [],
			srcTokensLoading: false,
			srcSearchValue: '',
			srcOffset: 0,
			setSrcTokens: (tokens: ExtendedToken[] | []) => set({ srcTokens: tokens }),
			addSrcTokens: (tokens: ExtendedToken[] | []) =>
				set(state => ({ srcTokens: [...state.srcTokens, ...tokens] })),
			setSrcTokensLoading: (isLoading: boolean) => set({ srcTokensLoading: isLoading }),
			setSrcSearchValue: (searchValue: string) => set({ srcSearchValue: searchValue }),
			setSrcOffset: (offset: number) => set({ srcOffset: offset }),
			clearSrcTokens: () => set({ srcTokens: [] }),
			setSrcSearchedTokens: (tokens: ExtendedToken[] | []) => set({ srcSearchedTokens: tokens }),
			addSrcSearchedTokens: (tokens: ExtendedToken[] | []) =>
				set(state => ({ srcSearchedTokens: [...state.srcSearchedTokens, ...tokens] })),
			clearSrcSearchedTokens: () => set({ srcSearchedTokens: [] }),

			dstTokens: [],
			dstSearchedTokens: [],
			dstTokensLoading: false,
			dstSearchValue: '',
			dstOffset: 0,
			setDstTokens: (tokens: ExtendedToken[] | []) => set({ dstTokens: tokens }),
			addDstTokens: (tokens: ExtendedToken[] | []) =>
				set(state => ({ dstTokens: [...state.dstTokens, ...tokens] })),
			setDstTokensLoading: (isLoading: boolean) => set({ dstTokensLoading: isLoading }),
			setDstSearchValue: (searchValue: string) => set({ dstSearchValue: searchValue }),
			setDstOffset: (offset: number) => set({ dstOffset: offset }),
			clearDstTokens: () => set({ dstTokens: [] }),
			setDstSearchedTokens: (tokens: ExtendedToken[] | []) => set({ dstSearchedTokens: tokens }),
			addDstSearchedTokens: (tokens: ExtendedToken[] | []) =>
				set(state => ({ dstSearchedTokens: [...state.dstSearchedTokens, ...tokens] })),
			clearDstSearchedTokens: () => set({ dstSearchedTokens: [] }),

			allTokens: [],
			allSearchedTokens: [],
			allTokensLoading: false,
			allSearchValue: '',
			allOffset: 0,
			setAllTokens: (tokens: ExtendedToken[] | []) => set({ allTokens: tokens }),
			addAllTokens: (tokens: ExtendedToken[] | []) =>
				set(state => ({ allTokens: [...state.allTokens, ...tokens] })),
			setAllTokensLoading: (isLoading: boolean) => set({ allTokensLoading: isLoading }),
			setAllSearchValue: (searchValue: string) => set({ allSearchValue: searchValue }),
			setAllOffset: (offset: number) => set({ allOffset: offset }),
			clearAllTokens: () => set({ allTokens: [] }),
			setAllSearchedTokens: (tokens: ExtendedToken[] | []) => set({ allSearchedTokens: tokens }),
			addAllSearchedTokens: (tokens: ExtendedToken[] | []) =>
				set(state => ({ allSearchedTokens: [...state.allSearchedTokens, ...tokens] })),
			clearAllSearchedTokens: () => set({ allSearchedTokens: [] }),
		}),
		Object.is,
	)
