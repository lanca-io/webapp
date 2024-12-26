import { type SwapAction, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { trackEvent } from '../../../../hooks/useTracking'
import { action, category } from '../../../../constants/tracking'
import { type WalletClient } from 'viem'
import { lanca } from '../../../../utils/initLancaSDK'
import { statusSwapMap } from './statusSwapMap'
import { type ExecutionConfig, type RouteType } from 'lanca-sdk-demo'

interface ExecuteConceroRoute {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
	route: RouteType
	walletClient: WalletClient
}

export async function executeConceroRoute({ swapState, swapDispatch, route, walletClient }: ExecuteConceroRoute) {
	try {
		const addExecutionListener = (state: RouteType) => {
			state.steps.forEach(step => {
				if (step.execution?.status && step.type) {
					statusSwapMap[step.type][step.execution.status](swapDispatch)
				}
			})
		}

		const executionConfig: ExecutionConfig = {
			updateRouteStatusHook: addExecutionListener,
		}

		trackEvent({
			category: category.SwapCard,
			action: action.BeginSwap,
			label: 'begin_swap',
			data: { from: swapState.from, to: swapState.to },
		})

		await lanca.executeRoute(route, walletClient, executionConfig)
	} catch (error: any) {
		const errorMessage = error.message || 'Internal error'
		const errorData = error.data || {}
		trackEvent({
			category: category.SwapCard,
			action: action.FrontendSwapFailed,
			label: 'fe_swap_failed',
			data: { route, error: { message: errorMessage, data: errorData } },
		})
	}
}
