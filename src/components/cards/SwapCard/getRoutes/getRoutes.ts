import { type Direction, type StandardRoute, type Step as ConceroStep } from '../../../../types/StandardRoute'
import { type SwapAction, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { type GetConceroRoutes, type PopulateRoutes } from './types'
import { trackEvent } from '../../../../hooks/useTracking'
import { action, category } from '../../../../constants/tracking'
import { findRoute } from '../../../../sdk/findRoute'
import type { Address } from 'viem'
import { type Route, type SwapDirectionData } from '../../../../sdk/types/routeTypes'

const populateRoutes = ({ routes, fromAmount, swapDispatch }: PopulateRoutes) => {
	swapDispatch({
		type: 'POPULATE_ROUTES',
		payload: routes,
		fromAmount,
	})
}

const providerDirection = (direction: SwapDirectionData): Direction => {
	const { token, chain, amount, chainId } = direction
	return {
		token: {
			name: token.name,
			address: token.address,
			symbol: token.symbol,
			decimals: token.decimals,
			price_usd: token.priceUsd,
			logo_uri: token.logoURI,
			amount,
			amount_usd: String(Number(amount) * Number(token.priceUsd)),
		},
		chain: {
			id: chain?.id ?? chainId,
			logo_uri: chain?.logoURI ?? null,
		},
		amount,
		amount_usd: String(Number(amount) * Number(token.priceUsd)),
		address: null,
	}
}

const routeDataProvider = (route: Route): StandardRoute => {
	const { data } = route
	const { from, to, steps } = data

	const newSteps = steps.map((step): ConceroStep => {
		const { from, to, tool } = step
		return {
			from: {
				token: {
					name: from.token.name,
					address: from.token.address,
					symbol: from.token.symbol,
					decimals: from.token.decimals,
					price_usd: from.token.priceUsd,
					logo_uri: from.token.logoURI,
					amount: from.amount,
					amount_usd: from.amount_usd,
				},
				chain: {
					id: from?.chain?.id ?? from.chainId,
					logo_uri: from.chain?.logoURI ?? null,
				},
				amount: from.amount,
				amount_usd: from.amount_usd,
				address: null,
			},
			to: {
				token: {
					name: to.token.name,
					address: to.token.address,
					symbol: to.token.symbol,
					decimals: to.token.decimals,
					price_usd: to.token.priceUsd,
					logo_uri: to.token.logoURI,
					amount: to.amount,
					amount_usd: to.amount_usd,
				},
				chain: {
					id: to?.chain?.id ?? to.chainId,
					logo_uri: to.chain?.logoURI ?? null,
				},
				amount: to.amount,
				amount_usd: to.amount_usd,
				address: null,
			},
			tool: {
				name: tool.name,
				logo_uri: tool.logo_url,
			},
		}
	})

	const standartRoute = {
		id: null,
		from: providerDirection(from),
		to: providerDirection(to),
		steps: [newSteps],
		cost: {
			total_usd: null,
			total_gas_usd: null,
		},
		tags: 'FASTEST',
		slippage_percent: 0.5,
		originalRoute: route,
	}

	return standartRoute
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

		const uniswapRoute: Route = await findRoute(routeRequest)
		if (!uniswapRoute.success) return false

		const conceroRoute = routeDataProvider(uniswapRoute)

		populateRoutes({ routes: [conceroRoute], fromAmount: swapState.from.amount, swapDispatch })
		return uniswapRoute.success
	} catch (error) {
		void trackEvent({
			category: category.SwapCard,
			action: action.FetchRangoRoutesError,
			label: 'fetch_uniswap_route_error',
			data: { error },
		})
		console.error('uniswap route', error)
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
			swapDispatch({ type: 'SET_IS_NO_ROUTES', status: true })
		}
	} catch (error) {
		console.error(error)
	} finally {
		swapDispatch({ type: 'SET_LOADING', payload: false })
	}
}
