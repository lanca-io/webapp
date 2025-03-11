import { createContext } from 'react'
import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { SettingsActions } from './types'

export type SettingsStore = UseBoundStoreWithEqualityFn<StoreApi<SettingsActions>>

export const SettingsStoreContext = createContext<SettingsStore | null>(null)
