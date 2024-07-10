import { type SwapAction, SwapCardStage, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { type ExecutionConfigs, type ExecutionState } from '../../../../sdk/types/executeSettingsTypes'
import { executeRoute } from '../../../../sdk/executeRoute/executeRoute'
import { statusSwapMap } from './statusSwapMap'
import { type Route } from '../../../../sdk/types/routeTypes'
import { getWalletClient } from '@wagmi/core'
import { config } from '../../../../web3/wagmi'

export async function executeConceroRoute(swapState: SwapState, swapDispatch: Dispatch<SwapAction>, route: Route) {
	swapDispatch({ type: 'SET_LOADING', payload: true })

	try {
		const walletClient = await getWalletClient(config, { chainId: Number(swapState.from.chain.id) })

		const addExecutionListener = (state: ExecutionState) => {
			statusSwapMap[state.stage](swapDispatch, state)
		}

		const executionConfig: ExecutionConfigs = {
			executionStateUpdateHook: addExecutionListener,
		}

		await executeRoute(walletClient, route, executionConfig)
	} catch (err) {
		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
		swapDispatch({
			type: 'SET_SWAP_STEPS',
			payload: [{ title: 'Transaction failed', body: 'Internal error', status: 'error' }],
		})
	}
}
