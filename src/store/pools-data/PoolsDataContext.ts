import type { PoolsStore } from './types'
import { createContext } from 'react'

export const PoolsDataContext = createContext<PoolsStore | null>(null)
