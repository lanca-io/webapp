import React from 'react'
import { toLocaleNumber } from '../../../../../../../../utils/formatting'

interface ProgressRangeProps {
	minValue: number
	maxValue: number
}

export const ProgressRange: React.FC<ProgressRangeProps> = ({ minValue, maxValue }) => (
	<div className="row jsb ac">
		<p className="body1">{toLocaleNumber(minValue)}</p>
		<p className="body1">{toLocaleNumber(maxValue)}</p>
	</div>
)
