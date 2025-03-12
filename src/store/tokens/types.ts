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
	sourceTokens: Token[]
	destinationTokens: Token[]

	selectedSourceToken: Token | null
	selectedDestinationToken: Token | null

	isSourceLoading: boolean
	isDestinationLoading: boolean
	sourceError: string | null
	destinationError: string | null

	sourceOffset: number
	destinationOffset: number
	sourceSearchValue: string
	destinationSearchValue: string

	setSourceTokens: (tokens: Token[]) => void
	setDestinationTokens: (tokens: Token[]) => void
	selectSourceToken: (token: Token) => void
	selectDestinationToken: (token: Token) => void
	clearSourceToken: () => void
	clearDestinationToken: () => void
	setSourceLoading: (isLoading: boolean) => void
	setDestinationLoading: (isLoading: boolean) => void
	setSourceError: (error: string | null) => void
	setDestinationError: (error: string | null) => void
	setSourceOffset: (offset: number) => void
	setDestinationOffset: (offset: number) => void
	setSourceSearchValue: (searchValue: string) => void
	setDestinationSearchValue: (searchValue: string) => void
	clearSourceTokens: () => void
	clearDestinationTokens: () => void
}
