import { memo } from 'react'
import { RouteTimer } from '../RouteTimer/RouteTimer'
import { SlippageInfo } from '../SlippageInfo/SlippageInfo'
import { GasInfo } from '../GasInfo/GasInfo'
import { ETAInfo } from '../ETAInfo/ETAInfo'
import { RouteInfo } from './RouteInfo/RouteInfo'
import './ReviewSection.pcss'

export const ReviewSection = memo(
	(): JSX.Element => (
		<div className="review_section" role="region" aria-label="Transaction review details">
			<RouteTimer />
			<RouteInfo />
			<div className="review_section_parameters" role="group" aria-label="Transaction parameters">
				<SlippageInfo />
				<GasInfo />
				<ETAInfo />
			</div>
		</div>
	),
)
