import type { FC } from 'react'
import { useState, useMemo, useCallback } from 'react'
import { ChartRange } from '../ChartMenu'
import { VolumeChart } from '../VolumeChart/VolumeChart'
import { BarChart } from '../BarChart/BarChart'
import { REWARDS_DATA, VOLUME_DATA } from './mock'
import { useIsTablet, useIsMobile } from '@/hooks'
import { PoolCompact } from '../PoolCompact/PoolCompact'
import { PoolExtended } from '../PoolExtended/PoolExtended'
import './PoolsDashboard.pcss'

export const PoolsDashboard: FC = () => {
	const [volumeRange, setVolumeRange] = useState(ChartRange.ALL)
	const [barRange, setBarRange] = useState(ChartRange.ALL)

	const isMobile: boolean = useIsMobile()
	const isTablet: boolean = useIsTablet()

	const showCompact = isMobile || isTablet

	const volumeTotal = useMemo(
		() => VOLUME_DATA.reduce((sum, d) => sum + d.value, 0),
		[],
	)
	const rewardsTotal = useMemo(
		() => REWARDS_DATA.reduce((sum, d) => sum + d.value, 0),
		[],
	)

	const volumeData = VOLUME_DATA
	const barData = REWARDS_DATA

	const handleVolumeRangeChange = useCallback((newRange: ChartRange) => {
		setVolumeRange(newRange)
	}, [])

	const handleBarRangeChange = useCallback((newRange: ChartRange) => {
		setBarRange(newRange)
	}, [])

	return (
		<div className="pools_dashboard">
			<div className="pools_analytics">
				<div className="pools_charts">
					<VolumeChart
						data={volumeData}
						total={volumeTotal}
						range={volumeRange}
						isLoading={false}
						onRangeChange={handleVolumeRangeChange}
					/>
					<BarChart
						data={barData}
						total={rewardsTotal}
						range={barRange}
						isLoading={false}
						onRangeChange={handleBarRangeChange}
					/>
				</div>
			</div>
			<div className="pools_list">
				<span className="pools_list_title">Pools</span>
				{showCompact ? (
					<PoolCompact
						isLoading={false}
						isConnected={false}
						cap={150000}
						tvl={110000}
						deposited={50000}
						earned={123.45}
					/>
				) : (
					<PoolExtended
						isLoading={true}
						isConnected={true}
						cap={150000}
						tvl={110000}
						deposited={50000}
						earned={123.45}
					/>
				)}
			</div>
		</div>
	)
}
