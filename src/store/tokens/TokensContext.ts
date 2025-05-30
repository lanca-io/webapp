import type { TokensStore } from './types'
import { createContext } from 'react'

export const TokensContext = createContext<TokensStore | null>(null)
