import { type Address } from 'viem'

export interface Token {
	_id: string
	address: Address
	chain_id: string
	decimals: number
	is_popular: true
	logoURI: string
	name: string
	symbol: string
	priceUsd: string
	providers: Provider[]
}

export interface Provider {
	_id: string
	name: string
	symbol: string
}

export interface Chain {
	id: string
	explorerURI: string
	logoURI: string
	name: string
	symbol: string
}

export interface SwapDirectionData {
	token: Token
	chain?: Chain
	chainId: string
	amount: string
	amount_usd?: string
}

export interface Fee {
	amount: string
	amount_usd: string
	type: string
	token: Token
}

export interface Step {
	from: SwapDirectionData
	to: SwapDirectionData
	tool: {
		name: string
		logo_url: string
		fees: Fee[]
		additional_info: {
			fee: number
			deadline: number
		}
	}
}

export interface Gas {
	amount: string
	amount_usd: string
	type: string
	token: Token
}

export interface RouteData {
	from: SwapDirectionData
	to: SwapDirectionData
	gas?: Gas
	fees?: Fee[]
	steps: Step[]
}

export interface Route {
	success: boolean
	data: RouteData
}

export interface RouteRequest {
	fromChainId: string
	fromAmount: string
	fromTokenAddress: Address
	fromAddress?: Address
	toChainId: string
	toTokenAddress: Address
	toAddress?: Address
}
