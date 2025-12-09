import { Tooltip } from '@/components/common/Tooltip/Tooltip'
import { InfoIcon } from '@/assets/icons/InfoIcon'
import './InfoTooltip.pcss'

export const InfoTooltip = (): JSX.Element => {
	return (
		<Tooltip
			tooltipId={'pools-volume-tooltip'}
			tooltipContent={
				<div className="volume_chart_tooltip_content">
					<span className="volume_chart_tooltip_title">Total Trading Volume</span>
					<span className="volume_chart_tooltip_description">
						Cumulative volume across all pools over the selected time period.
					</span>
				</div>
			}
			place="bottom"
			className="volume_chart_tooltip"
		>
			<div className="volume_chart_tooltip_icon">
				<InfoIcon color="var(--color-gray-600)" />
			</div>
		</Tooltip>
	)
}
