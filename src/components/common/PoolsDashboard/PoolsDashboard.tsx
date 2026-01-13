import type { FC } from 'react'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { ChartRange } from '../ChartMenu'
import { VolumeChart } from '../VolumeChart/VolumeChart'
import { BarChart } from '../BarChart/BarChart'
import { DATA_1M, DATA_3M, DATA_ALL } from './mock'
import { PoolCard } from '../PoolCard/PoolCard'
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
		const timer = setTimeout(() => setIsLoading(false), 1200)
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

	const poolProps = useMemo(
		() => ({
			token: {
				src: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
				alt: 'USDC Logo',
			},
			chain: {
				src: 'https://api.v2.concero.io/static/chains/42161.svg',
				alt: 'Arbitrum Logo',
			},
			isActive: true,
			isFull: true,
			isConnected: true,
			tokenLabel: 'USDC',
			chainLabel: 'ARB',
			tvl: 7890,
			deposited: 100,
		}),
		[],
	)

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
			</div>
			<div className="pools_list">
				<span className="pools_list_title">Pools</span>
				<PoolCard {...poolProps} />
			</div>
		</div>
	)
}
