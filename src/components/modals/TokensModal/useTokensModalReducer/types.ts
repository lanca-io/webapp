import { type ILancaChain } from '@lanca/sdk'
import { type Token, type TokenBalance } from '../../../../api/concero/types'

export enum TokenModalActionType {
	SET_SELECTED_CHAIN = 0,
	SET_OFFSET,
	SET_TOKENS,
	SET_BALANCE_TOKENS,
	SET_IS_LOADING,
	SET_IS_BALANCE_LOADING,
	UPSERT_TOKENS,
	SET_SEARCH_VALUE,
}

export interface TokensModalState {
	selectedChain: ILancaChain
	offset: number
	tokens: Token[]
	balanceTokens: TokenBalance | null
	isLoading: boolean
	isBalanceLoading: boolean
	searchValue: string
}

export interface SET_SELECTED_CHAIN {
	type: TokenModalActionType.SET_SELECTED_CHAIN
	chain: ILancaChain | null
}

export interface SET_OFFSET {
	type: TokenModalActionType.SET_OFFSET
	offset: number
}

export interface SET_TOKENS {
	type: TokenModalActionType.SET_TOKENS
	tokens: Token[]
}

export interface SET_BALANCE_TOKENS {
	type: TokenModalActionType.SET_BALANCE_TOKENS
	balanceTokens: TokenBalance | null
}

export interface SET_IS_LOADING {
	type: TokenModalActionType.SET_IS_LOADING
	isLoading: boolean
}

export interface SET_IS_BALANCE_LOADING {
	type: TokenModalActionType.SET_IS_BALANCE_LOADING
	isBalanceLoading: boolean
}

export interface UPSERT_TOKENS {
	type: TokenModalActionType.UPSERT_TOKENS
	tokens: Token[]
}

export interface SET_SEARCH_VALUE {
	type: TokenModalActionType.SET_SEARCH_VALUE
	searchValue: string
}

export type TokensModalAction =
	| SET_SELECTED_CHAIN
	| SET_OFFSET
	| SET_TOKENS
	| SET_BALANCE_TOKENS
	| SET_IS_LOADING
	| SET_IS_BALANCE_LOADING
	| UPSERT_TOKENS
	| SET_SEARCH_VALUE
