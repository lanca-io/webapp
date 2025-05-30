import type { ModalStore } from './types'
import { createContext } from 'react'

export const ModalsContext = createContext<ModalStore | null>(null)
