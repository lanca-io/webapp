import type { ChainsState } from './types'
import { createContext } from 'react'

export const ChainsContext = createContext<ChainsState | null>(null)
