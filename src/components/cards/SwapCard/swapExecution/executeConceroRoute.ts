import { type SwapAction, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { trackEvent } from '../../../../hooks/useTracking'
import { action, category } from '../../../../constants/tracking'
import { type WalletClient } from 'viem'
import { lanca } from '../../../../utils/initLancaSDK'
import { statusSwapMap } from './statusSwapMap'
import {
	StepType,
	type IExecutionConfig,
	type IRouteType,
	Status,
	type IRouteStep,
	type IRouteBaseStep,
} from 'lanca-sdk-demo'
import { SwapActionType, SwapCardStage, StageType } from '../swapReducer/types'

interface ExecuteConceroRoute {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
	route: IRouteType
	walletClient: WalletClient
}

export async function executeConceroRoute({ swapState, swapDispatch, route, walletClient }: ExecuteConceroRoute) {
	try {
		const addExecutionListener = (state: IRouteType) => {
			state.steps.forEach((step: IRouteStep | IRouteBaseStep) => {
				if (step.execution?.status && step.type) {
					if (step.type === StepType.BRIDGE && step.execution.error?.includes('CCIP')) {
						swapDispatch({ type: SwapActionType.SET_SWAP_STAGE, payload: SwapCardStage.warning })
						trackEvent({
							category: category.SwapCard,
							action: action.ClFunctionsFailed,
							label: 'cl_functions_failed',
							data: { route, txHash: step.execution.txHash },
						})
						swapDispatch({
							type: SwapActionType.SET_SWAP_STEPS,
							payload: [
								{
									title: 'Bridge failed',
									body: 'Something went wrong',
									status: Status.FAILED,
									type: StageType.error,
									txType: StepType.BRIDGE,
								},
							],
						})
					} else {
						statusSwapMap[step.type][step.execution.status](swapDispatch, state)
					}
				}
			})
		}

		const executionConfig: IExecutionConfig = {
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
