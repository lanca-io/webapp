import type { FC } from 'react'
import { useState, useMemo, useCallback } from 'react'
import { ChartRange } from '../ChartMenu'
import { VolumeChart } from '../VolumeChart/VolumeChart'
import { BarChart } from '../BarChart/BarChart'
import { REWARDS_DATA, VOLUME_DATA } from './mock'
import { PoolCard } from '../PoolCard/PoolCard'
import './PoolsDashboard.pcss'

export const PoolsDashboard: FC = () => {
	const [volumeRange, setVolumeRange] = useState(ChartRange.ALL)
	const [barRange, setBarRange] = useState(ChartRange.ALL)

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
				<PoolCard
					token={{
						src: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
						alt: 'USDC Logo',
					}}
					chain={{
						src: 'https://api.v2.concero.io/static/chains/42161.svg',
						alt: 'Arbitrum Logo',
					}}
					isActive={true}
					isFull={true}
					isConnected={true}
					tokenLabel="USDC"
					chainLabel="ARB"
					tvl={7890}
					deposited={100}
				/>
			</div>
		</div>
	)
}
