import { StageType, type SwapAction, SwapCardStage, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { type ExecutionConfigs, type ExecutionState } from '../../../../sdk/types/executeSettingsTypes'
import { executeRoute } from '../../../../sdk/executeRoute/executeRoute'
import { statusSwapMap } from './statusSwapMap'
import { type RouteData } from '../../../../sdk/types/routeTypes'
import { trackEvent } from '../../../../hooks/useTracking'
import { action, category } from '../../../../constants/tracking'
import { type WalletClient } from 'viem'

interface ExecuteConceroRoute {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
	route: RouteData
	walletClient: WalletClient
}

export async function executeConceroRoute({ swapState, swapDispatch, route, walletClient }: ExecuteConceroRoute) {
	swapDispatch({ type: 'SET_LOADING', payload: true })

	try {
		const addExecutionListener = (state: ExecutionState) => {
			statusSwapMap[state.stage](swapDispatch, state)
		}

		const executionConfig: ExecutionConfigs = {
			executionStateUpdateHook: addExecutionListener,
		}

		trackEvent({
			category: category.SwapCard,
			action: action.BeginSwap,
			label: 'begin_swap',
			data: { from: swapState.from, to: swapState.to },
		})

		await executeRoute(walletClient, route, executionConfig)
	} catch (error: any) {
		const errorMessage = error.message || 'Internal error'
		const errorData = error.data || {}

		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [
				{ title: 'Transaction failed', body: 'Internal error', status: 'error', type: StageType.warning },
			],
		})

		trackEvent({
			category: category.SwapCard,
			action: action.FrontendSwapFailed,
			label: 'fe_swap_failed',
			data: { route, error: { message: errorMessage, data: errorData } },
		})
	}
}
