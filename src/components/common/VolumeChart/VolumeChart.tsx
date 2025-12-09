import type { FC } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { IconButton } from '@concero/ui-kit'
import { InfoIcon } from '../../../assets/icons/InfoIcon'
import { AreaChart, Area, ResponsiveContainer, XAxis } from 'recharts'
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

// 1M: dense daily-ish points (labels like “11 Sep, 12 Sep...”)
const DATA_1M = [
	{ time: '2025-09-11', value: 18000 },
	{ time: '2025-09-12', value: 22000 },
	{ time: '2025-09-13', value: 21000 },
	{ time: '2025-09-14', value: 26000 },
	{ time: '2025-09-15', value: 24000 },
	{ time: '2025-09-16', value: 27000 },
	{ time: '2025-09-17', value: 30000 },
]

// 3M: weekly / multi‑day points (labels like “1 Sep, 7 Sep, 14 Sep...”)
const DATA_3M = [
	{ time: '2025-09-01', value: 15000 },
	{ time: '2025-09-07', value: 18000 },
	{ time: '2025-09-14', value: 21000 },
	{ time: '2025-09-21', value: 26000 },
	{ time: '2025-09-30', value: 30000 },
	{ time: '2025-10-15', value: 42000 },
	{ time: '2025-11-01', value: 52000 },
	{ time: '2025-11-15', value: 61000 },
	{ time: '2025-12-01', value: 75000 },
]

// ALL: coarse, month+year points (labels like “Jan 24, Mar, Jun, Oct, Jan 25”)
const DATA_ALL = [
	{ time: '2024-01-01', value: 8000 },
	{ time: '2024-03-01', value: 12000 },
	{ time: '2024-06-01', value: 20000 },
	{ time: '2024-10-01', value: 32000 },
	{ time: '2025-01-01', value: 45000 },
	{ time: '2025-06-01', value: 65000 },
	{ time: '2025-12-01', value: 90000 },
]

const formatLabelByRange = (value: string, range: VolumeRange, index: number, total: number) => {
	const d = new Date(String(value))

	if (Number.isNaN(d.getTime())) {
		return String(value)
	}

	if (range === VolumeRange.ALL) {
		const month = d.toLocaleDateString('en-US', { month: 'short' })
		const year = d.getFullYear().toString().slice(-2)

		// First and last ticks: month + year -> "Jan 24", "Jan 25"
		if (index === 0 || index === total - 1) {
			return `${month} ${year}`
		}

		// Middle ticks: just month -> "Mar", "Jun", "Oct"
		return month
	}

	// 1M / 3M: 1 Sep, 7 Sep, 14 Sep, ...
	return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

export const VolumeChart: FC = () => {
	const [range, setRange] = useState<VolumeRange>(VolumeRange.ALL)

	const onRangeChange = useCallback((value: VolumeRange) => {
		setRange(value)
	}, [])

	const chartData = useMemo(() => {
		switch (range) {
			case VolumeRange.ONE_MONTH:
				return DATA_1M
			case VolumeRange.THREE_MONTHS:
				return DATA_3M
			case VolumeRange.ALL:
			default:
				return DATA_ALL
		}
	}, [range])

	const totalValue = useMemo(() => chartData.reduce((sum, d) => sum + d.value, 0), [chartData])

	const formatTick = useCallback(
		(value: string, index: number) => formatLabelByRange(value, range, index, chartData.length),
		[range, chartData.length],
	)

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
					<span className="volume_chart_total_value">{totalValue.toLocaleString()}</span>
				</div>
			</div>
			<div className="volume_chart_visual">
				<ResponsiveContainer height="100%" width="100%">
					<AreaChart data={chartData}>
						<defs>
							<linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
								<stop offset="20.76%" stopColor="var(--color-accent-100)" stopOpacity={1} />
								<stop offset="99.62%" stopColor="var(--color-gray-25)" stopOpacity={1} />
							</linearGradient>
						</defs>

						<Area
							type="monotone"
							dataKey="value"
							stroke="var(--color-accent-400)"
							strokeWidth={2}
							fill="url(#volumeGradient)"
							activeDot={{ r: 6, stroke: 'var(--color-accent-400)', strokeWidth: 2 }}
						/>

						<XAxis
							dataKey="time"
							type="category"
							axisLine={false}
							tickLine={false}
							tickMargin={12}
							interval="preserveStartEnd"
							tickFormatter={formatTick}
							tick={{ fontSize: 12, fill: 'var(--color-gray-500)' }}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	)
}
