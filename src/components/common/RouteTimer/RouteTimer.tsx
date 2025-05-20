import { memo } from 'react'
import { Tag } from '@concero/ui-kit'
import { TimeIcon } from '../../../assets/icons/TimeIcon'
import { useLoadRoute } from '../../../hooks/Loadables/useLoadRoute'
import { useRouteStore } from '../../../store/route/useRouteStore'
import './RouteTimer.pcss'

const getVariant = (time: number) => {
	if (time <= 10) return 'negative'
	if (time <= 30) return 'warning'
	return 'neutral'
}

const TIMER_COLORS = {
	neutral: 'var(--color-grey-600)',
	warning: 'var(--color-warning-700)',
	negative: 'var(--color-danger-700)',
	branded: 'var(--color-grey-600)',
}

export const RouteTimer = memo(() => {
	const { route, isLoading } = useRouteStore()
	const { timeToRefresh } = useLoadRoute()

	if (!route || (!isLoading && (!timeToRefresh || timeToRefresh > 60))) return null

	const variant = isLoading ? 'branded' : getVariant(timeToRefresh)
	const color = TIMER_COLORS[variant]

	return (
		<Tag variant={variant} size="s" className="route_timer_tag">
			<div className="route_timer">
				<TimeIcon color={color} />
				<span className="route_info" style={{ color }}>
					{isLoading ? 'Updating route info...' : `${timeToRefresh}s`}
				</span>
			</div>
		</Tag>
	)
})
