import type { RoutesProviderProps, RoutesState } from './types'
import { RouteStepsValidation } from './RouteStepsValidation'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateRoutesStore = ({ route }: RoutesProviderProps) =>
	createWithEqualityFn<RoutesState>(
		set => ({
			route: route || null,
			error: null,
			loading: false,
			setRoute: route => {
				const validatedRoute = RouteStepsValidation(route)
				set({ route: validatedRoute })
			},
			clearRoute: () => {
				set({ route: null })
			},
			setError: error => {
				set({ error })
			},
			clearError: () => {
				set({ error: null })
			},
			setLoading: loading => {
				set({ loading })
			},
		}),
		Object.is,
	)
