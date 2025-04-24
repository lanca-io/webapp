import type { RoutesState } from './types'
import type { IRouteType } from '@lanca/sdk'
import { createWithEqualityFn } from 'zustand/traditional'

export const CreateRoutesStore = () =>
	createWithEqualityFn<RoutesState>(
		set => ({
			route: null,
			isLoading: false,
			setRoute: (route: IRouteType) => {
				const validatedSteps = route.steps.map(step => {
					if ('from' in step && 'to' in step) {
						return {
							...step,
							from: {
								...step.from,
								chain: step.from.chain,
							},
							to: {
								...step.to,
								chain: step.to.chain,
							},
						}
					}
					return step
				})

				set({
					route: {
						...route,
						steps: validatedSteps,
					},
				})
			},
			clearRoute: () => {
				set({ route: null })
			},
			setIsLoading: (isLoading: boolean) => {
				set({ isLoading })
			},
		}),
		Object.is,
	)
