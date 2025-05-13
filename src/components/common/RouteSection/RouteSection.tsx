import type { FC } from 'react'
import { useRouteStore } from '../../../store/route/useRouteStore'
import { RouteStep } from './RouteStep/RouteStep'
import { Spinner } from '@concero/ui-kit'
import './RouteSection.pcss'

export const RouteSection: FC = () => {
	const { route, isLoading } = useRouteStore()

	console.log('RouteSection', route, isLoading)

	return (
		<div className="route_section">
			<p className="route_section_heading">Route</p>
			<div className="route_section_content">
				{!isLoading && route?.steps.map((step, index) => <RouteStep key={index} step={step} />)}
				{isLoading && (
					<div className="route_section_loader">
						<Spinner type="gray" />
					</div>
				)}
			</div>
		</div>
	)
}
