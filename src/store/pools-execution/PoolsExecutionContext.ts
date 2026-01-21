import type { PoolsExecutionStore } from './types'
import { createContext } from 'react'

export const PoolsExecutionContext = createContext<PoolsExecutionStore | null>(
	null,
)
