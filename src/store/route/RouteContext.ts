import type { RoutesStore } from './types'
import { createContext } from 'react'

export const RoutesContext = createContext<RoutesStore | null>(null)
