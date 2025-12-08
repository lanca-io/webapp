import { type Dispatch } from 'react'
import { type ErrorType } from '../../../config/errors/ErrorType'
import type { Balance, PoolAction, PoolCardStage, PoolStateDirection } from '../poolReducer/types'

export interface TokenAreaProps {
	direction: 'to' | 'from'
	selection: PoolStateDirection
	balance?: Balance | null
	poolDispatch: Dispatch<PoolAction>
	isLoading?: boolean
	stage: PoolCardStage
	error?: ErrorType | null
	balanceLoading?: boolean
	setBalanceLoading?: Dispatch<boolean>
}
