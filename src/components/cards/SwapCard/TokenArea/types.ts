import { type Balance, type SwapAction, type SwapCardStage, type SwapStateDirection } from '../swapReducer/types'
import { type Dispatch } from 'react'
import { type ErrorType } from '../SwapButton/constants'
import { type RouteData } from '../../../../sdk/types/routeTypes'

export interface TokenAreaProps {
	direction: 'to' | 'from'
	selection: SwapStateDirection
	balance?: Balance | null
	swapDispatch: Dispatch<SwapAction>
	isLoading?: boolean
	stage: SwapCardStage
	error?: ErrorType | null
	route: RouteData | null
}
