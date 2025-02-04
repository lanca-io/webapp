import { type SwapAction, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { type GetConceroRoutes, type RouteRequest } from './types'
import { parseUnits, type Address } from 'viem'
import type { IRouteType, IRouteStep, IRouteBaseStep, ILancaChain } from 'lanca-sdk-demo'

import { SwapActionType } from '../swapReducer/types'
import { ErrorType } from '../SwapButton/constants'
import { getPoolLiquidity } from './getPoolLiquidity'
import { lanca } from '../../../../utils/initLancaSDK'

const validateRouteSteps = (route: IRouteType): IRouteType => {
	const { from, to } = route

	const chainDataMap: Record<string, ILancaChain> = {
		[from.chain.id]: from.chain,
		[to.chain.id]: to.chain,
	}

	const isValidStep = (step: IRouteStep | IRouteBaseStep): step is IRouteStep => 'from' in step && 'to' in step

	const validatedSteps = route.steps.map(step => {
		if (isValidStep(step)) {
			const fromChainId = step.from.chain?.id
			const toChainId = step.to.chain?.id

			return {
				...step,
				from: {
					...step.from,
					chain: fromChainId ? chainDataMap[fromChainId] : step.from.chain,
				},
				to: {
					...step.to,
					chain: toChainId ? chainDataMap[toChainId] : step.to.chain,
				},
			}
		}
		return step
	})

	return {
		...route,
		steps: validatedSteps,
	}
}

const getConceroRoute = async ({ swapState, swapDispatch }: GetConceroRoutes): Promise<boolean> => {
	try {
		const { from, to } = swapState

		const tolerance = '0.5'
		const amount = parseUnits(from.amount, from.token.decimals)
		const routeRequest: RouteRequest = {
			fromChainId: from.chain.id,
			toChainId: to.chain.id,
			fromToken: from.token.address as Address,
			toToken: to.token.address as Address,
			amount: amount.toString(),
			fromAddress: from.address as Address,
			toAddress: to.address as Address,
			slippageTolerance: tolerance,
		}

		const conceroRoute = await lanca.getRoute(routeRequest)
		if (!conceroRoute) return false

		const validStepsRoute = validateRouteSteps(conceroRoute)

		swapDispatch({
			type: SwapActionType.POPULATE_ROUTES,
			payload: [validStepsRoute],
			fromAmount: from.amount,
		})

		return true
	} catch (error) {
		console.error(error)
		return false
	}
}

export const getRoutes = async (swapState: SwapState, swapDispatch: Dispatch<SwapAction>): Promise<void> => {
	const { from, to } = swapState

	if (!from.amount || !parseFloat(from.amount)) return

	swapDispatch({ type: SwapActionType.SET_LOADING, payload: true })

	const isBridge = from.chain.id !== to.chain.id

	if (isBridge) {
		try {
			const poolAmount = await getPoolLiquidity(to.chain.id)
			const fromAmountUsd = (Number(from.amount) / Number(from.token.decimals)) * (from.token.priceUsd ?? 0)

			if (fromAmountUsd > Number(poolAmount)) {
				swapDispatch({ type: SwapActionType.SET_IS_SUFFICIENT_LIQUIDITY, payload: false })
				swapDispatch({ type: SwapActionType.SET_INPUT_ERROR, payload: ErrorType.NOT_SUFFICIENT_LIQUIDITY })
				swapDispatch({ type: SwapActionType.SET_LOADING, payload: false })
				return
			}
		} catch (error) {
			console.error('Error fetching pool amount:', error)
			swapDispatch({ type: SwapActionType.SET_LOADING, payload: false })
			return
		}
	}

	try {
		const isSuccess: boolean = await getConceroRoute({ swapState, swapDispatch })

		if (!isSuccess) {
			swapDispatch({ type: SwapActionType.SET_INPUT_ERROR, payload: ErrorType.NO_ROUTES })
		}
	} catch (error) {
		console.error('Error fetching route:', error)
		swapDispatch({ type: SwapActionType.SET_INPUT_ERROR, payload: ErrorType.FETCH_ROUTE_FAILED })
	} finally {
		swapDispatch({ type: SwapActionType.SET_LOADING, payload: false })
	}
}
