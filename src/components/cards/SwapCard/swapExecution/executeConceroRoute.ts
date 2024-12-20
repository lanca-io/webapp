import { StageType, type SwapAction, SwapCardStage, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { statusSwapMap } from './statusSwapMap'
import { trackEvent } from '../../../../hooks/useTracking'
import { action, category } from '../../../../constants/tracking'
import { type WalletClient } from 'viem'
import { type RouteType, Status, type ExecutionConfig } from 'lanca-sdk-demo'
import { lanca } from '../../../../utils/initLancaSDK'

interface ExecuteConceroRoute {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
	route: RouteType
	walletClient: WalletClient
}

export async function executeConceroRoute({ swapState, swapDispatch, route, walletClient }: ExecuteConceroRoute) {
	swapDispatch({ type: 'SET_LOADING', payload: true })

	try {
		const addExecutionListener = (state: RouteType) => {
			state.steps.forEach(step => {
				if (step.execution) {
					const statusFunction =
						step.execution.type && step.execution.status
							? statusSwapMap[step.execution.type][step.execution.status]
							: undefined
					if (statusFunction) {
						statusFunction(swapDispatch, state)
					} else {
						console.error(
							`No status function found for stage: ${step.execution.type} and status: ${step.execution.status}`,
						)
					}
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

		await lanca.executeRoute(route, walletClient as any, executionConfig)
	} catch (error: any) {
		const errorMessage = error.message || 'Internal error'
		const errorData = error.data || {}

		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [
				{ title: 'Transaction failed', body: 'Internal error', status: Status.FAILED, type: StageType.error },
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
