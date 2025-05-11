import { memo } from 'react'
import { Tag } from '@concero/ui-kit'
import { TimeIcon } from '../../assets/icons/TimeIcon'
import { useLoadRoute } from '../../hooks/Loadables/useLoadRoute'
import { useRouteStore } from '../../store/route/useRouteStore'
import './RouteTimer.pcss'

const getVariant = (time: number): 'negative' | 'warning' | 'neutral' => {
	if (time <= 10) return 'negative'
	if (time <= 30) return 'warning'
	return 'neutral'
}

export const RouteTimer = memo((): JSX.Element | null => {
	const { route, isLoading } = useRouteStore()
	const { timeToRefresh } = useLoadRoute()

	if (!route || (!isLoading && (!timeToRefresh || timeToRefresh > 60))) return null

	const variant: 'negative' | 'warning' | 'neutral' | 'branded' = isLoading ? 'branded' : getVariant(timeToRefresh)

	return (
		<Tag variant={variant} size="s" className="route_timer_tag">
			<div className="route_timer" aria-live="polite" role="status">
				<TimeIcon aria-hidden="true" />
				<span className="route_info">{isLoading ? 'Updating route info...' : `${timeToRefresh}s`}</span>
			</div>
		</Tag>
	)
})
