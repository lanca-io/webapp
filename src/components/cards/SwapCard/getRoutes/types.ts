import { type StandardRoute } from '../../../../types/StandardRoute'
import { type SwapAction, type SwapState } from '../swapReducer/types'
import { type Dispatch } from 'react'

export interface PopulateRoutes {
	routes: StandardRoute[] | []
	fromAmount: string
	swapDispatch: Dispatch<SwapAction>
}

export interface GetConceroRoutes {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
}
