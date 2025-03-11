import type { FormStoreStore } from './types'
import { createContext } from 'react'

export const FormStoreContext = createContext<FormStoreStore | null>(null)
