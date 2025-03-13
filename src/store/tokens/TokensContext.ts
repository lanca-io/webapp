import type { TokensStore } from './types'
import { createContext } from 'react'

export const TokensStoreContext = createContext<TokensStore | null>(null)
