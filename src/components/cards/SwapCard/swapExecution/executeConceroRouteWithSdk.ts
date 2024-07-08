import { type SwapAction, SwapCardStage, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { type Address, createWalletClient, custom } from 'viem'
import { arbitrum, polygon } from 'wagmi/chains'
import { type ExecutionConfigs, type ExecutionState } from '../../../../sdk/types/executeSettingsTypes'
import { executeRoute } from '../../../../sdk/executeRoute/executeRoute'
import { statusSwapMap } from './statusSwapMap'
import { type Route } from '../../../../sdk/types/routeTypes'

export async function executeConceroRouteWithSdk(
	swapState: SwapState,
	swapDispatch: Dispatch<SwapAction>,
	route: Route,
) {
	swapDispatch({ type: 'SET_LOADING', payload: true })

	try {
		const walletClient = createWalletClient({
			chain: polygon,
			transport: custom(window.ethereum),
		})

		const addExecutionListener = (state: ExecutionState) => {
			console.log(state)
			statusSwapMap[state.stage](swapDispatch, state)
		}

		const executionConfig: ExecutionConfigs = {
			executionStateUpdateHook: addExecutionListener,
		}

		await executeRoute(walletClient, route, executionConfig)
	} catch (err) {
		console.log(err)

		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [{ title: 'Transaction failed', body: 'Internal error', status: 'error' }],
		})
	}
}
