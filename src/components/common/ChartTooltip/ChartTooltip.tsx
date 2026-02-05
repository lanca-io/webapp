import type { FC } from 'react'
import './ChartTooltip.pcss'

type ChartTooltipProps = {
	active?: boolean
	payload?: Array<{ value: number }>
	label?: string
}

export const ChartTooltip: FC<ChartTooltipProps> = ({
	active,
	payload,
	label,
}) => {
	if (!active || !payload?.length || !label) return null

	const value = payload[0].value
	const date = new Date(label).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	})

	return (
		<div className="chart_tooltip">
			<div className="chart_tooltip_content">
				<span className="chart_tooltip_value">$ {value.toLocaleString()}</span>
				<span className="chart_tooltip_time">{date}</span>
			</div>
		</div>
	)
}
