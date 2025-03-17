import { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import { StoreApi } from 'zustand'

export type Token = {
	address: string
	chain_id: string
	chainLogoURI?: string | null
	decimals: number
	is_popular: boolean
	logoURI: string
	name: string
	symbol: string
	coinGeckoId: string | null
	priceUsd: number | null
}

export type ExtendedToken = Token & {
	balance?: string
}

export type TokensState = {
	srcTokens: ExtendedToken[]
	srcSearchedTokens: ExtendedToken[]
	srcTokensLoading: boolean
	srcSearchValue: string
	srcOffset: number
	setSrcTokens: (tokens: ExtendedToken[] | []) => void
	addSrcTokens: (tokens: ExtendedToken[] | []) => void
	setSrcTokensLoading: (isLoading: boolean) => void
	setSrcSearchValue: (searchValue: string) => void
	setSrcOffset: (offset: number) => void
	clearSrcTokens: () => void
	setSrcSearchedTokens: (tokens: ExtendedToken[] | []) => void
	addSrcSearchedTokens: (tokens: ExtendedToken[] | []) => void
	clearSrcSearchedTokens: () => void

	dstTokens: ExtendedToken[]
	dstSearchedTokens: ExtendedToken[]
	dstTokensLoading: boolean
	dstSearchValue: string
	dstOffset: number
	setDstTokens: (tokens: ExtendedToken[] | []) => void
	addDstTokens: (tokens: ExtendedToken[] | []) => void
	setDstTokensLoading: (isLoading: boolean) => void
	setDstSearchValue: (searchValue: string) => void
	setDstOffset: (offset: number) => void
	clearDstTokens: () => void
	setDstSearchedTokens: (tokens: ExtendedToken[] | []) => void
	addDstSearchedTokens: (tokens: ExtendedToken[] | []) => void
	clearDstSearchedTokens: () => void

	allTokens: ExtendedToken[]
	allSearchedTokens: ExtendedToken[]
	allTokensLoading: boolean
	allSearchValue: string
	allOffset: number
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

export type TokensStore = UseBoundStoreWithEqualityFn<StoreApi<TokensState>>
