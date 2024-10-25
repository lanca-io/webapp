import { type SwapAction, SwapCardStage, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { type ExecutionConfigs, type ExecutionState } from '../../../../sdk/types/executeSettingsTypes'
import { executeRoute } from '../../../../sdk/executeRoute/executeRoute'
import { statusSwapMap } from './statusSwapMap'
import { type RouteData } from '../../../../sdk/types/routeTypes'
import { getWalletClient } from '@wagmi/core'
import { config } from '../../../../web3/wagmi'
import { trackEvent } from '../../../../hooks/useTracking'
import { action, category } from '../../../../constants/tracking'

export async function executeConceroRoute(swapState: SwapState, swapDispatch: Dispatch<SwapAction>, route: RouteData) {
	swapDispatch({ type: 'SET_LOADING', payload: true })

	try {
		const walletClient = await getWalletClient(config, { chainId: Number(swapState.from.chain.id) })

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

		console.log('USER BALANCE:', swapState.balance.amount.formatted)
		await executeRoute(walletClient, route, executionConfig)
	} catch (error) {
		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [{ title: 'Transaction failed', body: 'Internal error', status: 'error' }],
		})

		trackEvent({
			category: category.SwapCard,
			action: action.FrontendSwapFailed,
			label: 'fe_swap_failed',
			data: { route, error },
		})
	}
}
