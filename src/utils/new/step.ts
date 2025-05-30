import type { IRouteStep, IRouteBaseStep } from '@lanca/sdk'
import { StepType } from '@lanca/sdk'
import { toTitleCase } from '../formatting'

/**
 * Returns a human-readable title for the given step type.
 *
 * @param type - The StepType enum value.
 * @returns The display title for the step.
 */
export function getStepTitle(type: StepType): string {
	switch (type) {
		case StepType.SRC_SWAP:
		case StepType.DST_SWAP:
			return 'Swap'
		case StepType.BRIDGE:
			return 'Bridge'
		default:
			return 'Swap'
	}
}

/**
 * Type guard that checks if an object has a string 'name' property.
 *
 * @param obj - The object to check.
 * @returns True if the object has a string 'name' property, otherwise false.
 */
function isToolWithName(obj: any): obj is { name: string } {
	return typeof obj?.name === 'string'
}

/**
 * Extracts and formats the tool name from a route step, if available.
 *
 * @param step - The route step object, which may have a tool or internalSteps property.
 * @returns The tool name in title case, or an empty string if not found.
 */
export function getToolName(step: IRouteStep | IRouteBaseStep): string {
	if ('internalSteps' in step) {
		const firstStep = step.internalSteps?.[0]
		if (firstStep?.tool && isToolWithName(firstStep.tool)) {
			return toTitleCase(firstStep.tool.name)
		}
	}

	if ('tool' in step && isToolWithName(step.tool)) {
		return toTitleCase(step.tool.name)
	}

	return ''
}

/**
 * Type guard to determine if a step is a complex step (has 'from' and 'to' and is a swap or bridge).
 *
 * @param step - The step object to check.
 * @returns True if the step is a complex step, otherwise false.
 */
export function isComplexStep(step: any): step is IRouteStep {
	return 'from' in step && 'to' in step && [StepType.SRC_SWAP, StepType.BRIDGE, StepType.DST_SWAP].includes(step.type)
}
