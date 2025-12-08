import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { IconButton } from '@concero/ui-kit'
import { InfoIcon } from '@/assets/icons/InfoIcon'
import { ResponsiveContainer, AreaChart } from 'recharts'
import './VolumeChart.pcss'

enum VolumeRange {
	ONE_MONTH = '1M',
	THREE_MONTHS = '3M',
	ALL = 'ALL',
}

const RANGE_OPTIONS: { label: string; value: VolumeRange }[] = [
	{ label: 'M', value: VolumeRange.ONE_MONTH },
	{ label: '3M', value: VolumeRange.THREE_MONTHS },
	{ label: 'All', value: VolumeRange.ALL },
]

export const VolumeChart: FC = () => {
	const [range, setRange] = useState<VolumeRange>(VolumeRange.ALL)

	const onRangeChange = useCallback((value: VolumeRange) => {
		setRange(value)
	}, [])

	return (
		<div className="volume_chart">
			<div className="volume_chart_heading">
				<div className="volume_chart_toolbar">
					<div className="volume_chart_description">
						<span className="volume_chart_label">Pools volume</span>
						<InfoIcon color="var(--color-gray-600)" />
					</div>
					<div className="volume_chart_menu">
						{RANGE_OPTIONS.map(option => (
							<IconButton
								key={option.value}
								variant={range === option.value ? 'secondary' : 'tetrary'}
								size="s"
								onClick={() => onRangeChange(option.value)}
								className="volume_chart_menu_option"
							>
								{option.label}
							</IconButton>
						))}
					</div>
				</div>
				<div className="volume_chart_total">
					<span className="volume_chart_total_symbol">$</span>
					<span className="volume_chart_total_value">100K</span>
				</div>
			</div>
			<div className="volume_chart_visual">
				<ResponsiveContainer>
					<AreaChart data={[]}></AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
