import type { FC } from 'react'
import { Menu } from '../Menu'
import { VolumeRange } from '../types'
import { InfoTip } from '../../InfoTip'
import { useCompactNumber } from '@/hooks'
import './Heading.pcss'

type HeadingProps = {
	range: VolumeRange
	total: number
	onRangeChange: (range: VolumeRange) => void
}

export const Heading: FC<HeadingProps> = ({ range, total, onRangeChange }) => {
	const { format } = useCompactNumber()

	return (
		<div className="volume_chart_heading">
			<div className="volume_chart_toolbar">
				<div className="volume_chart_description">
					<span className="volume_chart_label">Pools volume</span>
					<InfoTip
						id="volume_chart_info_tip"
						title="Total Volume"
						description=" Cumulative volume across all pools over the selected time period"
					/>
				</div>
				<Menu currentRange={range} onRangeChange={onRangeChange} />
			</div>
			<div className="volume_chart_total">
				<span className="volume_chart_total_symbol">$</span>
				<span className="volume_chart_total_value">{format(total)}</span>
			</div>
		</div>
	)
}
