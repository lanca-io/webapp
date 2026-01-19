import type { PoolActionExecutionStore } from './types'
import { createContext } from 'react'

export const PoolActionExecutionContext =
	createContext<PoolActionExecutionStore | null>(null)
