import type { FC } from 'react'
import { Tooltip } from '../Tooltip/Tooltip'
import { InfoIcon } from '@/assets/icons/InfoIcon'
import './StatisticsCard.pcss'

type StatisticsCardProps = {
	title: string
	value: number
	units: string
	tooltip: {
		title: string
		description: string
	}
}

export const StatisticsCard: FC<StatisticsCardProps> = ({
	title,
	value,
	units,
	tooltip,
}): JSX.Element => {
	return (
		<div className="statistics_card">
			<div className="statistics_card_heading">
				<span className="statistics_card_title">{title}</span>
				<Tooltip
					tooltipId={`statistics-card-tooltip-${title}`}
					tooltipContent={
						<div className="statistics_card_tooltip_content">
							<span className="statistics_card_tooltip_title">
								{tooltip.title}
							</span>
							<span className="statistics_card_tooltip_description">
								{tooltip.description}
							</span>
						</div>
					}
					place="bottom"
					className="statistics_card_tooltip"
				>
					<div className="statistics_card_tooltip_icon">
						<InfoIcon color="var(--color-gray-600)" />
					</div>
				</Tooltip>
			</div>
			<div className="statistics_card_value_content">
				<span className="statistics_card_value">{value}</span>
				<span className="statistics_card_value_unit">{units}</span>
			</div>
		</div>
	)
}
