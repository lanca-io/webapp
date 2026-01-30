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
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
import { usePoolsPositions } from '@/store/pools-positions/usePoolsPositionsStore'
import { useAccount } from 'wagmi'
import './PoolsDashboard.pcss'

export const PoolsDashboard: FC = () => {
	const [volumeRange, setVolumeRange] = useState(ChartRange.ALL)
	const [rewardsRange, setRewardsRange] = useState(ChartRange.ALL)

	const { cap, tvl, lpPrice, isLoading: poolsLoading } = usePoolsDataStore()
	const { lp, balancesLoading } = usePoolsPositions()
	const { isConnected } = useAccount()

	const isMobile = useIsMobile()
	const isTablet = useIsTablet()
	const showCompact = isMobile || isTablet

	const lpValue = useMemo(() => {
		if (!Number.isFinite(lp ?? 0) || !Number.isFinite(lpPrice ?? 0)) {
			return 0
		}
		return (lp ?? 0) * (lpPrice ?? 0)
	}, [lp, lpPrice])

	const isDataLoaded = useMemo(
		() => !poolsLoading && !balancesLoading && Number.isFinite(lpValue),
		[poolsLoading, balancesLoading, lpValue],
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
						total={'-'}
						settings={{
							isLoading: false,
							isAdvanced: true,
							leftDenomination: '$',
							range: volumeRange,
							onChange: handleVolumeRange,
						}}
					/>
					<BarChart
						data={rewardsData}
						title="Total rewards"
						description="Total rewards distributed to liquidity providers across all pools"
						total={'-'}
						settings={{
							isLoading: false,
							isAdvanced: true,
							leftDenomination: '$',
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
						isLoading={!isDataLoaded}
						isConnected={isConnected}
						cap={cap}
						tvl={tvl}
						deposited={lpValue}
						earned={123.45}
					/>
				) : (
					<PoolExtended
						isLoading={!isDataLoaded}
						isConnected={isConnected}
						cap={cap}
						tvl={tvl}
						deposited={lpValue}
						earned={123.45}
					/>
				)}
			</div>
		</div>
	)
}
