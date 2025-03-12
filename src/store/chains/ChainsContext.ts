import type { ChainStore } from './types'
import { createContext } from 'react'

export const ChainsContext = createContext<ChainStore | null>(null)
