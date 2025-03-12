export type Provider = {
	name: string
	symbol: string
	_id: string
}

export type Token = {
	_id: string
	address: string
	chain_id: string
	decimals: number
	is_popular: boolean
	logoURI: string
	name: string
	providers: Provider[]
	symbol: string
	coinGeckoId: string
	priceUsd: number | null
	balance?: string
}

export type TokensState = {
	tokens: Token[]
	isLoading: boolean
	error: string | null
	offset: number
	searchValue: string
	setTokens: (tokens: Token[]) => void
	setLoading: (isLoading: boolean) => void
	setError: (error: string) => void
	setOffset: (offset: number) => void
	setSearchValue: (searchValue: string) => void
	clearTokens: () => void
}
