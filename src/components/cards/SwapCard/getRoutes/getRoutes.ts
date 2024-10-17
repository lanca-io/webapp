import { type SwapAction, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { type GetConceroRoutes } from './types'
import { findRoute } from '../../../../sdk/findRoute'
import type { Address } from 'viem'
import { type Route, type RouteData, type Step } from '../../../../sdk/types/routeTypes'
import { ErrorType } from '../SwapButton/constants'

const routeDataProvider = (route: RouteData): RouteData => {
	const { from, to } = route

	const chainDataMap = {
		[from.chain.id]: from.chain,
		[to.chain.id]: to.chain,
	}

	const newSteps = route.steps.map((step): Step => {
		const fromChainId = step.from.chain ? step.from.chain : step.from.chainId
		const toChainId = step.to.chain ? step.to.chain : step.to.chainId

		return {
			...step,
			from: {
				...step.from,
				chainData: fromChainId ? chainDataMap[fromChainId] : null,
			},
			to: {
				...step.to,
				chainData: toChainId ? chainDataMap[toChainId] : null,
			},
		}
	})

	return {
		...route,
		steps: newSteps,
	}
}

const getConceroRoute = async ({ swapState, swapDispatch }: GetConceroRoutes): Promise<boolean> => {
	try {
		const routeRequest = {
			fromChainId: swapState.from.chain.id,
			fromAmount: swapState.from.amount,
			fromTokenAddress: swapState.from.token.address as Address,
			fromAddress: swapState.from.address as Address,
			toChainId: swapState.to.chain.id,
			toTokenAddress: swapState.to.token.address as Address,
			toAddress: swapState.to.address as Address,
		}

		const conceroRoute: Route = await findRoute(routeRequest)

		if (!conceroRoute?.success) return false

		swapDispatch({
			type: 'POPULATE_ROUTES',
			payload: [routeDataProvider(conceroRoute.data)],
			fromAmount: swapState.from.amount,
		})

		return conceroRoute.success
	} catch (error) {
		return false
	}
}

export const getRoutes = async (swapState: SwapState, swapDispatch: Dispatch<SwapAction>): Promise<void> => {
	const { from } = swapState

	if (!from.amount || !parseFloat(from.amount)) return

	swapDispatch({ type: 'SET_LOADING', payload: true })

	try {
		const isSuccess: boolean = await getConceroRoute({ swapState, swapDispatch })

		if (!isSuccess) {
			swapDispatch({ type: 'SET_INPUT_ERROR', payload: ErrorType.NO_ROUTES })
		}
	} catch (error) {
		console.error(error)
	} finally {
		swapDispatch({ type: 'SET_LOADING', payload: false })
	}
}
