import type { SubvariantStore } from './types'
import { createContext } from 'react'

export const SubvariantContext = createContext<SubvariantStore | null>(null)
