import type { SettingsStore } from './types'
import { createContext } from 'react'

export const SettingsContext = createContext<SettingsStore | null>(null)
