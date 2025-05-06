import type { IRouteType } from '@lanca/sdk'
import type { UseBoundStoreWithEqualityFn } from 'zustand/traditional'
import type { StoreApi } from 'zustand'

export type RoutesStateSlice = {
	route: IRouteType | null
	isLoading: boolean
}

export type RoutesActions = {
	setRoute: (route: IRouteType | null) => void
	clearRoute: () => void
	setIsLoading: (isLoading: boolean) => void
}

export type RoutesState = RoutesStateSlice & RoutesActions
export type RoutesStore = UseBoundStoreWithEqualityFn<StoreApi<RoutesState>>
