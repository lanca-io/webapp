import { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import { StoreApi } from 'zustand'

export type Token = {
	chain_id: number
	decimals: number
	address: string
	chainLogoURI?: string
	logo_url: string
	name: string
	symbol: string
	price_usd: string
}

export type ExtendedToken = Token & {
	balance?: string
}

export interface TokensStateData {
	tokens: ExtendedToken[]
	searchedTokens: ExtendedToken[]
	isLoading: boolean
	searchValue: string
	offset: number

	allTokens: ExtendedToken[]
	allSearchedTokens: ExtendedToken[]
	allTokensLoading: boolean
	allSearchValue: string
	allOffset: number
}

export interface TokensStateActions {
	setTokens: (tokens: ExtendedToken[] | []) => void
	addTokens: (tokens: ExtendedToken[] | []) => void
	setLoading: (isLoading: boolean) => void
	setSearchValue: (searchValue: string) => void
	setOffset: (offset: number) => void
	clearTokens: () => void
	setSearchedTokens: (tokens: ExtendedToken[] | []) => void
	addSearchedTokens: (tokens: ExtendedToken[] | []) => void
	clearSearchedTokens: () => void

	setAllTokens: (tokens: ExtendedToken[] | []) => void
	addAllTokens: (tokens: ExtendedToken[] | []) => void
	setAllTokensLoading: (isLoading: boolean) => void
	setAllSearchValue: (searchValue: string) => void
	setAllOffset: (offset: number) => void
	clearAllTokens: () => void
	setAllSearchedTokens: (tokens: ExtendedToken[] | []) => void
	addAllSearchedTokens: (tokens: ExtendedToken[] | []) => void
	clearAllSearchedTokens: () => void
}

export type TokensState = TokensStateData & TokensStateActions
export type TokensStore = UseBoundStoreWithEqualityFn<StoreApi<TokensState>>
