import { createContext } from 'react'
import type { SplitSubvariantStore } from './types'

export const SplitSubvariantStoreContext = createContext<SplitSubvariantStore | null>(null)
