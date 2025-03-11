import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { TokensState } from './types'
import type { StoreApi } from 'zustand'
import { createContext } from 'react'

export type TokensStore = UseBoundStoreWithEqualityFn<StoreApi<TokensState>>

export const TokensStoreContext = createContext<TokensStore | null>(null)
