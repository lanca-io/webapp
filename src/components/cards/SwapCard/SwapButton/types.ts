import { type SwapState } from '../swapReducer/types'
import type { providers } from 'ethers'

export interface SwapButtonProps {
	swapState: SwapState
	isConnected: boolean
	onClick: () => void
	switchChainHook: (requiredChainId: number) => Promise<providers.JsonRpcSigner>
}
