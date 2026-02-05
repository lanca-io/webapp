import type { PoolsActionContextValue } from './types'
import { createContext } from 'react'

export const PoolsActionContext = createContext<PoolsActionContextValue | null>(
	null,
)
