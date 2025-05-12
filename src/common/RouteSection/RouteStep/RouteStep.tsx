import type { IRouteStep, IRouteBaseStep } from '@lanca/sdk'
import { memo } from 'react'
import { RouteDirection } from '../RouteDirection/RouteDirection'
import { getStepTitle, getToolName } from '../../../utils/new/step'
import './RouteStep.pcss'

type InnerStepCardProps = {
	step: IRouteStep | IRouteBaseStep
}

export const RouteStep = memo(({ step }: InnerStepCardProps) => {
	const title = getStepTitle(step.type)
	const toolName = getToolName(step)

	const hasDirections = 'from' in step && 'to' in step

	return (
		<div className="route_step">
			<div className="route_step_content">
				<p className="route_step_type">{title}</p>
				{toolName && (
					<p className="route_step_pointer">
						{'via'} {toolName}
					</p>
				)}
			</div>

			{hasDirections && (
				<div className="route_step_directions">
					<RouteDirection data={(step as IRouteStep).from} heading="From" />
					<RouteDirection data={(step as IRouteStep).to} heading="To" />
				</div>
			)}
		</div>
	)
})
