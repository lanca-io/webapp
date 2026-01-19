import type { PoolsStore } from './types'
import { createContext } from 'react'

export const PoolsContext = createContext<PoolsStore | null>(null)
