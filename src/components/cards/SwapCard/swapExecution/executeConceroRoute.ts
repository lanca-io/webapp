import { type SwapAction, SwapActionType, SwapCardStage, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { trackEvent } from '../../../../hooks/useTracking'
import { action, category } from '../../../../constants/tracking'
import { type WalletClient } from 'viem'
import { lanca } from '../../../../utils/initLancaSDK'
import { statusSwapMap } from './statusSwapMap'
import { Status, type ExecutionConfig, type RouteType } from 'lanca-sdk-demo'

interface ExecuteConceroRoute {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
	route: RouteType
	walletClient: WalletClient
}

export async function executeConceroRoute({ swapState, swapDispatch, route, walletClient }: ExecuteConceroRoute) {
	swapDispatch({ type: SwapActionType.SET_LOADING, payload: true })

	try {
		const addExecutionListener = (state: RouteType) => {
			state.steps.forEach(step => {
				if (step.type in statusSwapMap) {
					console.log('step', step)
					statusSwapMap[step.type](swapDispatch, state)
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

		swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.failed })
		swapDispatch({
			type: SwapActionType.SET_SWAP_STEPS,
			payload: [{ title: 'Transaction failed', status: Status.FAILED }],
		})

		trackEvent({
			category: category.SwapCard,
			action: action.FrontendSwapFailed,
			label: 'fe_swap_failed',
			data: { route, error: { message: errorMessage, data: errorData } },
		})
	}
}
