import type { FC } from 'react'
import { memo } from 'react'
import { Tag } from '@concero/ui-kit'
import { TimeIcon } from '../../assets/icons/TimeIcon'
import { useLoadRoute } from '../../hooks/Loadables/useLoadRoute'
import './RouteTimer.pcss'

export const RouteTimer: FC = memo(() => {
	const { timeToRefresh, isRouteLoading } = useLoadRoute()

	console.log(isRouteLoading)

	if (isRouteLoading) {
		return (
			<Tag variant="branded" size="m">
				<div className="route_timer">
					<TimeIcon aria-hidden="true" />
					<span className="route_time">Updating route info...</span>
				</div>
			</Tag>
		)
	}

	if (!timeToRefresh || timeToRefresh > 60) return null

	const variant = timeToRefresh <= 10 ? 'negative' : timeToRefresh <= 30 ? 'warning' : 'neutral'

	return (
		<Tag variant={variant} size="m">
			<div className="route_timer">
				<TimeIcon aria-hidden="true" />
				<span className="route_time">{timeToRefresh}s</span>
			</div>
		</Tag>
	)
})
