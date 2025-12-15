import type { FC } from 'react'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { ChartRange } from '../ChartMenu'
import { VolumeChart } from '../VolumeChart/VolumeChart'
import { StatisticsCard } from '../StatisticsCard/StatisticsCard'
import { BarChart } from '../BarChart/BarChart'
import './PoolsDashboard.pcss'

// REALISTIC 1M data (29 daily points, Nov 17 - Dec 15, 2025)
const DATA_1M = [
	{ time: '2025-11-17', value: 45200 },
	{ time: '2025-11-18', value: 47800 },
	{ time: '2025-11-19', value: 42300 },
	{ time: '2025-11-20', value: 48900 },
	{ time: '2025-11-21', value: 51200 },
	{ time: '2025-11-22', value: 46700 },
	{ time: '2025-11-23', value: 53400 },
	{ time: '2025-11-24', value: 59800 },
	{ time: '2025-11-25', value: 56200 },
	{ time: '2025-11-26', value: 64500 },
	{ time: '2025-11-27', value: 58900 },
	{ time: '2025-11-28', value: 71200 },
	{ time: '2025-11-29', value: 67800 },
	{ time: '2025-11-30', value: 82300 },
	{ time: '2025-12-01', value: 75600 },
	{ time: '2025-12-02', value: 89100 },
	{ time: '2025-12-03', value: 93400 },
	{ time: '2025-12-04', value: 102300 },
	{ time: '2025-12-05', value: 98700 },
	{ time: '2025-12-06', value: 112400 },
	{ time: '2025-12-07', value: 119800 },
	{ time: '2025-12-08', value: 134200 },
	{ time: '2025-12-09', value: 128900 },
	{ time: '2025-12-10', value: 145600 },
	{ time: '2025-12-11', value: 152300 },
	{ time: '2025-12-12', value: 167800 },
	{ time: '2025-12-13', value: 174500 },
	{ time: '2025-12-14', value: 189200 },
	{ time: '2025-12-15', value: 203400 },
]

// REALISTIC 3M data (13 weekly points, Sep 15 - Dec 8, 2025)
const DATA_3M = [
	{ time: '2025-09-15', value: 34200 },
	{ time: '2025-09-22', value: 38700 },
	{ time: '2025-09-29', value: 42300 },
	{ time: '2025-10-06', value: 47800 },
	{ time: '2025-10-13', value: 51200 },
	{ time: '2025-10-20', value: 58900 },
	{ time: '2025-10-27', value: 63400 },
	{ time: '2025-11-03', value: 71200 },
	{ time: '2025-11-10', value: 78900 },
	{ time: '2025-11-17', value: 85600 },
	{ time: '2025-11-24', value: 92300 },
	{ time: '2025-12-01', value: 102300 },
	{ time: '2025-12-08', value: 119800 },
]

// REALISTIC ALL data (24 monthly points, Jan 2024 - Dec 2025)
const DATA_ALL = [
	{ time: '2024-01-01', value: 15200 },
	{ time: '2024-02-01', value: 18700 },
	{ time: '2024-03-01', value: 23400 },
	{ time: '2024-04-01', value: 28900 },
	{ time: '2024-05-01', value: 34500 },
	{ time: '2024-06-01', value: 41200 },
	{ time: '2024-07-01', value: 47800 },
	{ time: '2024-08-01', value: 52300 },
	{ time: '2024-09-01', value: 58900 },
	{ time: '2024-10-01', value: 63400 },
	{ time: '2024-11-01', value: 71200 },
	{ time: '2024-12-01', value: 78900 },
	{ time: '2025-01-01', value: 85600 },
	{ time: '2025-02-01', value: 92300 },
	{ time: '2025-03-01', value: 102300 },
	{ time: '2025-04-01', value: 119800 },
	{ time: '2025-05-01', value: 134200 },
	{ time: '2025-06-01', value: 152300 },
	{ time: '2025-07-01', value: 167800 },
	{ time: '2025-08-01', value: 189200 },
	{ time: '2025-09-01', value: 203400 },
	{ time: '2025-10-01', value: 234500 },
	{ time: '2025-11-01', value: 267800 },
	{ time: '2025-12-01', value: 312400 },
]

export const PoolsDashboard: FC = () => {
	const [range, setRange] = useState(ChartRange.ALL)
	const [isLoading, setIsLoading] = useState(true)

	// Pre-compute ALL totals once (stable reference)
	const totals = useMemo(
		() => ({
			[ChartRange.ONE_MONTH]: DATA_1M.reduce((sum, d) => sum + d.value, 0),
			[ChartRange.THREE_MONTHS]: DATA_3M.reduce((sum, d) => sum + d.value, 0),
			[ChartRange.ALL]: DATA_ALL.reduce((sum, d) => sum + d.value, 0),
		}),
		[],
	)

	// Single initial load simulation (1.2s), then instant switches
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 1200)
		return () => clearTimeout(timer)
	}, [])

	// Switch data instantly (stable reference)
	const chartData = useMemo(() => {
		switch (range) {
			case ChartRange.ONE_MONTH:
				return DATA_1M
			case ChartRange.THREE_MONTHS:
				return DATA_3M
			default:
				return DATA_ALL
		}
	}, [range])

	// Instant range switch (stable callback)
	const handleRangeChange = useCallback((newRange: ChartRange) => {
		setRange(newRange)
	}, [])

	return (
		<div className="pools_dashboard">
			<div className="pools_analytics">
				<div className="pools_charts">
					<VolumeChart />
					<BarChart
						data={chartData}
						total={totals[range]}
						range={range}
						isLoading={isLoading}
						onRangeChange={handleRangeChange}
					/>
				</div>
				<div className="pools_statistics">
					<StatisticsCard
						title="TXs"
						value={2847}
						tooltip={{
							title: 'Total Transactions',
							description:
								'Total number of transactions executed through Concero.',
						}}
						units="TX"
					/>
					<StatisticsCard
						title="Providers"
						value={847}
						tooltip={{
							title: 'Liquidity Providers',
							description:
								'Number of users currently providing liquidity to the pools.',
						}}
						units="Users"
					/>
				</div>
			</div>
		</div>
	)
}
