import { memo } from 'react'
import { Tag } from '@concero/ui-kit'
import { TimeIcon } from '../../../assets/icons/TimeIcon'
import { useLoadRouteQuote } from '../../../hooks/Loadables/useLoadRouteQuote'
import { useRouteStore } from '../../../store/route/useRouteStore'
import './RouteTimer.pcss'

const getVariant = (time: number) => {
	if (time <= 10) return 'negative'
	if (time <= 30) return 'warning'
	return 'neutral'
}

const TIMER_COLORS = {
	neutral: 'var(--color-grey-600)',
	warning: 'var(--color-warning-600)',
	negative: 'var(--color-danger-600)',
	branded: 'var(--color-primary-600)',
}

const TEXT_COLORS = {
	neutral: 'var(--color-grey-600)',
	warning: 'var(--color-warning-700)',
	negative: 'var(--color-danger-700)',
	branded: 'var(--color-primary-700)',
}

export const RouteTimer = memo(() => {
	const { route, isLoading } = useRouteStore()
	const { timeToRefresh } = useLoadRouteQuote()

	if (!route || (!isLoading && (!timeToRefresh || timeToRefresh > 60))) return null

	const variant = isLoading ? 'branded' : getVariant(timeToRefresh)
	const iconColor = TIMER_COLORS[variant]
	const textColor = TEXT_COLORS[variant]

	return (
		<Tag variant={variant} size="s" className="route_timer_tag">
			<div className="route_timer">
				<TimeIcon color={iconColor} />
				<span className="route_info" style={{ color: textColor }}>
					{isLoading ? 'Updating route info...' : `${timeToRefresh}s`}
				</span>
			</div>
		</Tag>
	)
})
