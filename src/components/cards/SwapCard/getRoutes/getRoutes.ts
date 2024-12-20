import { type SwapAction, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { type GetConceroRoutes } from './types'
import { type Address } from 'viem'
import { ErrorType } from '../SwapButton/constants'
import { getPoolAmount } from '../handlers/getPoolAmount'
import { lanca } from '../../../../utils/initLancaSDK'
import type { RouteType, ConceroChain, RouteStep, RouteBaseStep } from 'lanca-sdk-demo'

const routeDataProvider = (route: RouteType): RouteType => {
	const { from, to } = route

	const chainDataMap: Record<string, ConceroChain> = {
		[from.chain.id]: from.chain,
		[to.chain.id]: to.chain,
	}

	const newSteps = route.steps.map((step): RouteStep | RouteBaseStep => {
		if ('from' in step && 'to' in step) {
			const fromChainId = step.from.chain ? step.from.chain.id : step.from.chain
			const toChainId = step.to.chain ? step.to.chain.id : step.to.chain

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
		steps: newSteps,
	}
}

const getConceroRoute = async ({ swapState, swapDispatch }: GetConceroRoutes): Promise<boolean> => {
	try {
		const routeRequest = {
			fromChainId: swapState.from.chain.id.toString(),
			toChainId: swapState.to.chain.id.toString(),
			fromToken: swapState.from.token.address as Address,
			toToken: swapState.to.token.address as Address,
			amount: swapState.from.amount,
			fromAddress: swapState.from.address as Address,
			toAddress: swapState.to.address as Address,
			slippageTolerance: '0.5',
		}

		const conceroRoute = await lanca.getRoute(routeRequest)
		if (!conceroRoute) return false

		swapDispatch({
			type: 'POPULATE_ROUTES',
			payload: [routeDataProvider(conceroRoute)],
			fromAmount: swapState.from.amount,
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

	swapDispatch({ type: 'SET_LOADING', payload: true })

	const isBridge = from.chain.id !== to.chain.id

	if (isBridge) {
		const dstChainId = to.chain.id
		const poolAmount = await getPoolAmount(dstChainId)
		const fromAmountUsd = Number(from.amount) * (from.token.priceUsd ?? 0)

		if (fromAmountUsd > Number(poolAmount)) {
			swapDispatch({ type: 'SET_IS_SUFFICIENT_LIQUIDITY', payload: false })
			return
		}
	}

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
