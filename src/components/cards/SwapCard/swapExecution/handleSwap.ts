import { handleTransactionError } from '../handlers/handleTransactionError'
import { type GetChainByProviderSymbolI } from '../../../../hooks/DataContext/types'
import { type SwitchChainHookType } from '../SwapInput/types'
import { type Dispatch } from 'react'
import { type SwapAction, SwapCardStage, type SwapState } from '../swapReducer/types'
import { type providers } from 'ethers'
import { executeConceroRoute } from './executeConceroRoute'
import { trackEvent } from '../../../../hooks/useTracking'
import { action, category } from '../../../../constants/tracking'

interface HandleSwapProps {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
	address: string | undefined
	switchChainHook: SwitchChainHookType
	getChainByProviderSymbol: GetChainByProviderSymbolI
	getSigner: () => Promise<providers.JsonRpcSigner>
	isNewSwapCardMode: boolean
}

export const handleSwap = async ({ swapState, swapDispatch }: HandleSwapProps): Promise<void> => {
	const { selectedRoute } = swapState
	const { originalRoute } = selectedRoute

	if (!originalRoute) {
		console.error('No original route passed')
		return
	}

	swapDispatch({ type: 'SET_LOADING', payload: true })
	swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.progress })

	try {
		void trackEvent({
			category: category.SwapCard,
			action: action.BeginSwap,
			label: 'begin_swap',
			data: { from: swapState.from, to: swapState.to },
		})
		executeConceroRoute(swapState, swapDispatch, originalRoute)
	} catch (error: Error) {
		handleTransactionError(error, swapDispatch, selectedRoute)
	} finally {
		swapDispatch({ type: 'SET_LOADING', payload: false })
	}
}
