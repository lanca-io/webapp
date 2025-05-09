import type { FC } from 'react'
import { RouteTimer } from '../RouteTimer/RouteTimer'
import './ReviewSection.pcss'

export const ReviewSection: FC = () => {
	return (
		<div className="review_section">
			<RouteTimer />
		</div>
	)
}
