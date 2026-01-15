import type { FC } from 'react'
import { useState, useMemo, useCallback } from 'react'
import { ChartRange } from '../ChartMenu'
import { AreaChart } from '../AreaChart/AreaChart'
import { BarChart } from '../BarChart/BarChart'
import { REWARDS_DATA, VOLUME_DATA } from './mock'
import { useIsTablet, useIsMobile } from '@/hooks'
import { PoolCompact } from '../PoolCompact/PoolCompact'
import { PoolExtended } from '../PoolExtended/PoolExtended'
import { MetricsBanner } from '../MetricsBanner/MetricsBanner'
import './PoolsDashboard.pcss'

export const PoolsDashboard: FC = () => {
	const [volumeRange, setVolumeRange] = useState(ChartRange.ALL)
	const [rewardsRange, setRewardsRange] = useState(ChartRange.ALL)

	const isMobile = useIsMobile()
	const isTablet = useIsTablet()
	const showCompact = isMobile || isTablet

	const volumeTotal = useMemo(
		() => VOLUME_DATA.reduce((sum, d) => sum + d.value, 0),
		[],
	)
	const rewardsTotal = useMemo(
		() => REWARDS_DATA.reduce((sum, d) => sum + d.value, 0),
		[],
	)

	const volumeData = useMemo(() => VOLUME_DATA, [])
	const rewardsData = useMemo(() => REWARDS_DATA, [])

	const handleVolumeRange = useCallback((range: ChartRange) => {
		setVolumeRange(range)
	}, [])

	const handleRewardsRange = useCallback((range: ChartRange) => {
		setRewardsRange(range)
	}, [])

	return (
		<div className="pools_dashboard">
			<MetricsBanner />
			<div className="pools_analytics">
				<div className="pools_charts">
					<AreaChart
						title="Pools volume"
						total={volumeTotal}
						symbol="$"
						data={volumeData}
						range={volumeRange}
						isLoading={false}
						onRangeChange={handleVolumeRange}
						tip={{
							id: 'volume_tip',
							description: 'Total trading volume across all liquidity pools.',
						}}
					/>
					<BarChart
						title="Total rewards"
						total={rewardsTotal}
						symbol="$"
						data={rewardsData}
						range={rewardsRange}
						isLoading={false}
						onRangeChange={handleRewardsRange}
						tip={{
							id: 'rewards_tip',
							description:
								'Total rewards distributed to liquidity providers across all pools.',
						}}
					/>
				</div>
			</div>
			<div className="pools_list">
				<span className="pools_list_title">Pools</span>
				{showCompact ? (
					<PoolCompact
						isLoading={false}
						isConnected={true}
						cap={150000}
						tvl={150000}
						deposited={0}
						earned={123.45}
					/>
				) : (
					<PoolExtended
						isLoading={false}
						isConnected={true}
						cap={150000}
						tvl={150000}
						deposited={0}
						earned={123.45}
					/>
				)}
			</div>
		</div>
	)
}
