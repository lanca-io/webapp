import { type Address } from 'viem'

export interface BridgeData {
	amount: bigint
	dstChainSelector: bigint
	receiver: Address
}

export interface InputSwapData {
	tokenType: number
	fromToken: Address
	fromAmount: bigint
	toToken: Address
	toAmount: bigint
	toAmountMin: bigint
}

export interface Integration {
	integrator: Address
	feeBps: number
}

export type TxName = 'swap' | 'bridge' | 'swapAndBridge'

export interface InputRouteData {
	bridgeData: BridgeData | null
	srcSwapData: InputSwapData[]
	dstSwapData: string
	integration: Integration
}

export type SwapArgs = Array<InputSwapData[] | BridgeData | bigint | Address>
