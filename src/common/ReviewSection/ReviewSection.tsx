import type { FC } from 'react'
import { useMemo } from 'react'
import { RouteTimer } from '../RouteTimer/RouteTimer'
import { SlippageInfo } from '../SlippageInfo/SlippageInfo'
import { GasInfo } from '../GasInfo/GasInfo'
import { ETAInfo } from '../ETAInfo/ETAInfo'
import { RouteInfo } from './RouteInfo/RouteInfo'
import './ReviewSection.pcss'

export const ReviewSection: FC = () => {
	const routeTimer = useMemo(() => <RouteTimer />, [])
	const routeInfo = useMemo(() => <RouteInfo />, [])
	const slippageInfo = useMemo(() => <SlippageInfo />, [])
	const gasInfo = useMemo(() => <GasInfo />, [])
	const etaInfo = useMemo(() => <ETAInfo />, [])

	return (
		<div className="review_section">
			{routeTimer}
			{routeInfo}
			<div className="review_section_parameters">
				{slippageInfo}
				{gasInfo}
				{etaInfo}
			</div>
		</div>
	)
}
