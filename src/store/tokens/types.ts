import { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import { StoreApi } from 'zustand'

export type Token = {
	address: string
	chain_id: string
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
	srcTokensLoading: boolean
	srcSearchValue: string
	srcOffset: number
	setSrcTokens: (tokens: ExtendedToken[] | []) => void
	setSrcTokensLoading: (isLoading: boolean) => void
	setSrcSearchValue: (searchValue: string) => void
	setSrcOffset: (offset: number) => void
	clearSrcTokens: () => void

	dstTokens: ExtendedToken[]
	dstTokensLoading: boolean
	dstSearchValue: string
	dstOffset: number
	setDstTokens: (tokens: ExtendedToken[] | []) => void
	setDstTokensLoading: (isLoading: boolean) => void
	setDstSearchValue: (searchValue: string) => void
	setDstOffset: (offset: number) => void
	clearDstTokens: () => void
}

export type TokensStore = UseBoundStoreWithEqualityFn<StoreApi<TokensState>>
