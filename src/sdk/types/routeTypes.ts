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
	chain: Chain
	amount: string
}

export interface StepDirectionData {
	token: Token
	chain?: string
	chainId?: string
	chainData?: Chain
	amount: string
}

export interface Fee {
	amount: string
	amount_usd: string
	type: string
	token: Token
}

export interface Step {
	from: StepDirectionData
	to: StepDirectionData
	tool: {
		name: string
		logo_url: string
		fees: Fee[]
		type: 'bridge' | 'swap'
		additional_info: {
			fee: number
			deadline: number
			containDstUnwrapWNative?: boolean
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
