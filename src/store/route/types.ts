import type { IRouteType } from '@lanca/sdk'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'

export interface RoutesState {
	route: IRouteType | null
	error?: string | null
	loading: boolean
	setRoute: (route: IRouteType) => void
	clearRoute: () => void
	setError: (error: string) => void
	clearError: () => void
	setLoading: (loading: boolean) => void
}

export type RoutesStore = UseBoundStoreWithEqualityFn<StoreApi<RoutesState>>

export interface RoutesProviderProps {
	route?: IRouteType
}
