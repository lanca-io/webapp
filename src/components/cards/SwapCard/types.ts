import { type Step } from '../../../types/StandardRoute'
import { type Chain, type Token } from '../../../api/concero/types'
import { type Dispatch } from 'react'
import { type SwapAction, type SwapState } from './swapReducer/types'

export interface SwapDetailsProps {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
}

export interface Selection {
	chain: Chain
	token: Token
}

export interface AvatarsProps {
	entities: Step[]
}
