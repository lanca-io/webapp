import type { InputContextValue } from './types'
import { createContext } from 'react'

export const InputWidgetContext = createContext<InputContextValue | null>(null)
