import type { FC } from 'react'
import { Menu } from '../Menu'
import { VolumeRange } from '../types'
import { InfoTip } from '../../InfoTip'
import './Heading.pcss'

type HeadingProps = {
	range: VolumeRange
	onRangeChange: (range: VolumeRange) => void
}

export const Heading: FC<HeadingProps> = ({ range, onRangeChange }) => {
	return (
		<div className="volume_chart_heading">
			<div className="volume_chart_toolbar">
				<div className="volume_chart_description">
					<span className="volume_chart_label">Pools volume</span>
					<InfoTip
						id="volume_chart_info_tip"
						title="Total Volume"
						description=" Cumulative volume across all pools over the selected time period"
						place="bottom"
					/>
				</div>
				<Menu currentRange={range} onRangeChange={onRangeChange} />
			</div>
			<div className="volume_chart_total">
				<span className="volume_chart_total_symbol">$</span>
				<span className="volume_chart_total_value">{'-'}</span>
			</div>
		</div>
	)
}
