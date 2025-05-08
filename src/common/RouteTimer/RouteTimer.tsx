import { FC, memo } from 'react'
import { Tag } from '@concero/ui-kit'
import { TimeIcon } from '../../assets/icons/TimeIcon'
import { useLoadRoute } from '../../hooks/Loadables/useLoadRoute'
import { useRouteStore } from '../../store/route/useRouteStore'
import './RouteTimer.pcss'

const getVariant = (time: number) => {
	if (time <= 10) return 'negative'
	if (time <= 30) return 'warning'
	return 'neutral'
}

export const RouteTimer: FC = memo(() => {
	const { route, isLoading } = useRouteStore()
	const { timeToRefresh } = useLoadRoute()

	if (!route || (!isLoading && (!timeToRefresh || timeToRefresh > 60))) return null

	if (isLoading) {
		return (
			<Tag variant="branded" size="m" className="route_timer_tag">
				<div className="route_timer">
					<TimeIcon aria-hidden="true" />
					<span className="route_time">Updating route info...</span>
				</div>
			</Tag>
		)
	}

	return (
		<Tag variant={getVariant(timeToRefresh)} size="m" className="route_timer_tag">
			<div className="route_timer">
				<TimeIcon aria-hidden="true" />
				<span className="route_time">{timeToRefresh}s</span>
			</div>
		</Tag>
	)
})
