import type { TokensState, ExtendedToken } from './types'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateTokensStore = () =>
	createWithEqualityFn<TokensState>(
		set => ({
			tokens: [],
			searchedTokens: [],
			isLoading: false,
			searchValue: '',
			offset: 0,

			allTokens: [],
			allSearchedTokens: [],
			allTokensLoading: false,
			allSearchValue: '',
			allOffset: 0,

			setTokens: (tokens: ExtendedToken[] | []) => set({ tokens }),

			addTokens: (tokens: ExtendedToken[] | []) => set(state => ({ tokens: [...state.tokens, ...tokens] })),

			setLoading: (isLoading: boolean) => set({ isLoading }),

			setSearchValue: (searchValue: string) => set({ searchValue }),

			setOffset: (offset: number) => set({ offset }),

			clearTokens: () => set({ tokens: [] }),

			setSearchedTokens: (tokens: ExtendedToken[] | []) => set({ searchedTokens: tokens }),

			addSearchedTokens: (tokens: ExtendedToken[] | []) =>
				set(state => ({ searchedTokens: [...state.searchedTokens, ...tokens] })),

			clearSearchedTokens: () => set({ searchedTokens: [] }),

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
