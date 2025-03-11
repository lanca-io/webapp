import type { IRouteType, IRouteStep, IRouteBaseStep } from '@lanca/sdk'

export const RouteStepsValidation = (route: IRouteType): IRouteType => {
	const isValidStep = (step: IRouteStep | IRouteBaseStep): step is IRouteStep => 'from' in step && 'to' in step

	const validatedSteps = route.steps.map(step => {
		if (isValidStep(step)) {
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

	return {
		...route,
		steps: validatedSteps,
	}
}
