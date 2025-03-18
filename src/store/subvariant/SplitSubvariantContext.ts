import type { SplitSubvariantStore } from './types'
import { createContext } from 'react'

export const SplitSubvariantStoreContext = createContext<SplitSubvariantStore | null>(null)
