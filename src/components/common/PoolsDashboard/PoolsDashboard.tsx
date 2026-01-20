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
import { usePoolsStore } from '@/store/pools/usePoolsStore'
import { useAccount } from 'wagmi'
import './PoolsDashboard.pcss'

export const PoolsDashboard: FC = () => {
	const [volumeRange, setVolumeRange] = useState(ChartRange.ALL)
	const [rewardsRange, setRewardsRange] = useState(ChartRange.ALL)

	const { cap, tvl, isLoading } = usePoolsStore()
	const { isConnected } = useAccount()

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
						data={volumeData}
						title="Pools volume"
						description="Total trading volume across all liquidity pools"
						total={volumeTotal}
						settings={{
							isLoading: false,
							isAdvanced: true,
							denomination: '$',
							range: volumeRange,
							onChange: handleVolumeRange,
						}}
					/>
					<BarChart
						data={rewardsData}
						title="Total rewards"
						description="Total rewards distributed to liquidity providers across all pools"
						total={rewardsTotal}
						settings={{
							isLoading: false,
							isAdvanced: true,
							denomination: '$',
							range: rewardsRange,
							onChange: handleRewardsRange,
						}}
					/>
				</div>
			</div>
			<div className="pools_list">
				<span className="pools_list_title">Pools</span>
				{showCompact ? (
					<PoolCompact
						isLoading={isLoading}
						isConnected={isConnected}
						cap={cap}
						tvl={tvl}
						deposited={0}
						earned={123.45}
					/>
				) : (
					<PoolExtended
						isLoading={isLoading}
						isConnected={isConnected}
						cap={cap}
						tvl={tvl}
						deposited={0}
						earned={123.45}
					/>
				)}
			</div>
		</div>
	)
}
