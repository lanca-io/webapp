import { handleTransactionError } from '../handlers/handleTransactionError'
import { handleLifiResponse, handleRangoResponse } from './handleResponses'
import { updateLifiSteps } from './updateLifiSteps'
import { type GetChainByProviderSymbolI } from '../../../../hooks/DataContext/types'
import { type SwitchChainHookType } from '../SwapInput/types'
import { type Dispatch } from 'react'
import { type SwapAction, SwapCardStage, type SwapState } from '../swapReducer/types'
import { type providers } from 'ethers'
import { executeConceroRouteWithSdk } from './executeConceroRouteWithSdk'

interface HandleSwapProps {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
	address: string | undefined
	switchChainHook: SwitchChainHookType
	getChainByProviderSymbol: GetChainByProviderSymbolI
	getSigner: () => Promise<providers.JsonRpcSigner>
	isNewSwapCardMode: boolean
}

export const handleSwap = async ({
	swapState,
	swapDispatch,
	address,
	switchChainHook,
	getChainByProviderSymbol,
	getSigner,
	isNewSwapCardMode,
}: HandleSwapProps): Promise<void> => {
	const { from, settings, selectedRoute } = swapState
	const { originalRoute } = selectedRoute

	const provider = 'uniswap'

	if (!originalRoute) {
		console.error('No original route passed')
		return
	}

	swapDispatch({ type: 'SET_LOADING', payload: true })
	swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.progress })

	try {
		executeConceroRouteWithSdk(swapState, swapDispatch, originalRoute)
	} catch (error: Error) {
		console.error('ERROR: ', error)
		handleTransactionError(error, swapDispatch, selectedRoute)
	} finally {
		swapDispatch({ type: 'SET_LOADING', payload: false })
	}
}
