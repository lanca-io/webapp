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

	const content = isLoading ? (
		<span className="route_info">Updating route info...</span>
	) : (
		<span className="route_info">{timeToRefresh}s</span>
	)

	const variant = isLoading ? 'branded' : getVariant(timeToRefresh)

	return (
		<Tag variant={variant} size="s" className="route_timer_tag">
			<div className="route_timer">
				<TimeIcon aria-hidden="true" />
				{content}
			</div>
		</Tag>
	)
})
