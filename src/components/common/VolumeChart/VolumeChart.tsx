import type { FC } from 'react'
import { useCallback, useMemo, useState } from 'react'
import { Heading } from './Heading'
import { Chart } from './Chart/Chart'
import { VolumeRange } from './types'
import './VolumeChart.pcss'

export const DATA_1M = [
	{ time: '2025-09-11', value: 26000 },
	{ time: '2025-09-12', value: 24000 },
	{ time: '2025-09-13', value: 25000 },
	{ time: '2025-09-14', value: 23000 },
	{ time: '2025-09-15', value: 19000 },
	{ time: '2025-09-16', value: 24000 },
	{ time: '2025-09-17', value: 25000 },
	{ time: '2025-09-18', value: 33000 },
	{ time: '2025-09-19', value: 31000 },
	{ time: '2025-09-20', value: 22000 },
	{ time: '2025-09-21', value: 31000 },
	{ time: '2025-09-22', value: 28000 },
	{ time: '2025-09-23', value: 26000 },
	{ time: '2025-09-24', value: 26000 },
	{ time: '2025-09-25', value: 26000 },
	{ time: '2025-09-26', value: 26000 },
	{ time: '2025-09-27', value: 19000 },
	{ time: '2025-09-28', value: 24000 },
	{ time: '2025-09-29', value: 27000 },
	{ time: '2025-09-30', value: 32000 },
	{ time: '2025-10-01', value: 31000 },
	{ time: '2025-10-02', value: 29000 },
	{ time: '2025-10-03', value: 33000 },
	{ time: '2025-10-04', value: 34000 },
	{ time: '2025-10-05', value: 36000 },
	{ time: '2025-10-06', value: 38000 },
]

export const DATA_3M = [
	{ time: '2025-09-01', value: 12000 },
	{ time: '2025-09-08', value: 8000 },
	{ time: '2025-09-16', value: 18000 },
	{ time: '2025-09-23', value: 10000 },
	{ time: '2025-10-01', value: 14000 },
	{ time: '2025-10-08', value: 27000 },
	{ time: '2025-10-16', value: 30000 },
	{ time: '2025-10-24', value: 49000 },
	{ time: '2025-10-31', value: 58000 },
	{ time: '2025-11-08', value: 59000 },
	{ time: '2025-11-15', value: 55000 },
	{ time: '2025-11-23', value: 67000 },
	{ time: '2025-12-01', value: 77000 },
]

export const DATA_ALL = [
	{ time: '2024-01-01', value: 12000 },
	{ time: '2024-01-31', value: 26000 },
	{ time: '2024-03-01', value: 28000 },
	{ time: '2024-04-01', value: 44000 },
	{ time: '2024-05-01', value: 40000 },
	{ time: '2024-06-01', value: 51000 },
	{ time: '2024-07-01', value: 45000 },
	{ time: '2024-08-01', value: 41000 },
	{ time: '2024-08-31', value: 47000 },
	{ time: '2024-09-30', value: 38000 },
	{ time: '2024-10-31', value: 45000 },
	{ time: '2024-11-30', value: 49000 },
	{ time: '2024-12-31', value: 62000 },
	{ time: '2025-01-30', value: 58000 },
	{ time: '2025-03-02', value: 58000 },
	{ time: '2025-04-01', value: 63000 },
	{ time: '2025-05-01', value: 53000 },
	{ time: '2025-06-01', value: 50000 },
	{ time: '2025-07-01', value: 51000 },
	{ time: '2025-08-01', value: 55000 },
	{ time: '2025-08-31', value: 70000 },
	{ time: '2025-10-01', value: 80000 },
	{ time: '2025-10-31', value: 85000 },
	{ time: '2025-12-01', value: 95000 },
]

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

	const totalValue = useMemo(
		() => chartData.reduce((sum, d) => sum + d.value, 0),
		[chartData],
	)

	const heading = useMemo(
		() => (
			<Heading range={range} total={totalValue} onRangeChange={onRangeChange} />
		),
		[range, totalValue, onRangeChange],
	)

	const chart = useMemo(
		() => <Chart data={chartData} range={range} />,
		[chartData, range],
	)

	return (
		<div className="volume_chart">
			{heading}
			{chart}
		</div>
	)
}
