import type { PoolsPositionsStore } from './types'
import { createContext } from 'react'

export const PoolsPositionsContext = createContext<PoolsPositionsStore | null>(
	null,
)
