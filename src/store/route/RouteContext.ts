import { createContext } from 'react'
import type { StoreApi } from 'zustand'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { RoutesState } from './types'

export type RouteStore = UseBoundStoreWithEqualityFn<StoreApi<RoutesState>>

export const RouteContext = createContext<RouteStore | null>(null)
