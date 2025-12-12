import type { FC } from 'react'
import { useMemo } from 'react'
import { ChartMenu, ChartRange } from '../ChartMenu'
import { InfoTip } from '../InfoTip'
import { useCompactNumber } from '@/hooks'
import './Heading.pcss'

type HeadingProps = {
	title: string
	range: ChartRange
	value: { amount: number; symbol?: string }
	onChange: (range: ChartRange) => void
}

export const Heading: FC<HeadingProps> = ({
	title,
	range,
	value: { amount, symbol = '$' },
	onChange,
}) => {
	const { format } = useCompactNumber()

	const info = useMemo(
		() => (
			<InfoTip
				id="volume_chart_info_tip"
				title="Total Volume"
				description="Cumulative volume across all pools over the selected time period"
			/>
		),
		[],
	)

	const menu = useMemo(
		() => <ChartMenu range={range} onChange={onChange} />,
		[range, onChange],
	)

	return (
		<div className="chart_heading">
			<div className="chart_toolbar">
				<div className="chart_description">
					<span className="chart_label">{title}</span>
					{info}
				</div>
				{menu}
			</div>
			<div className="chart_total">
				<span className="chart_total_symbol">{symbol}</span>
				<span className="chart_total_value">{format(amount)}</span>
			</div>
		</div>
	)
}
