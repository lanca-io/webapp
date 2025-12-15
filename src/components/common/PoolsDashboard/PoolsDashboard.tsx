import type { FC } from 'react'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { ChartRange } from '../ChartMenu'
import { VolumeChart } from '../VolumeChart/VolumeChart'
import { StatisticsCard } from '../StatisticsCard/StatisticsCard'
import { BarChart } from '../BarChart/BarChart'
import { DATA_1M, DATA_3M, DATA_ALL } from './mock'
import './PoolsDashboard.pcss'

export const PoolsDashboard: FC = () => {
	const [range, setRange] = useState(ChartRange.ALL)
	const [isLoading, setIsLoading] = useState(true)

	const totals = useMemo(
		() => ({
			[ChartRange.ONE_MONTH]: DATA_1M.reduce((sum, d) => sum + d.value, 0),
			[ChartRange.THREE_MONTHS]: DATA_3M.reduce((sum, d) => sum + d.value, 0),
			[ChartRange.ALL]: DATA_ALL.reduce((sum, d) => sum + d.value, 0),
		}),
		[],
	)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false)
		}, 1200)
		return () => clearTimeout(timer)
	}, [])

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
