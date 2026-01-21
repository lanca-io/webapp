import type { PoolsUserBalanceStore } from './types'
import { createContext } from 'react'

export const PoolsUserBalancesContext =
	createContext<PoolsUserBalanceStore | null>(null)
