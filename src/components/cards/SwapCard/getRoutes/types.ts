import { type SwapAction, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { type Address, type Chain } from 'viem'

export interface PoolConfig {
	chain: Chain
	conceroContract: Address
	usdcContract: Address
}

export interface RouteRequest {
	fromChainId: string
	toChainId: string
	fromToken: Address
	toToken: Address
	amount: string
	fromAddress: Address
	toAddress: Address
	slippageTolerance: string
}

export interface GetConceroRoutes {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
}
