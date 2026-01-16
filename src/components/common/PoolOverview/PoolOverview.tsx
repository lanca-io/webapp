import type { FC, ReactElement } from 'react'
import { useState, useMemo, useCallback } from 'react'
import { ChartRange } from '../ChartMenu'
import { AreaChart } from '../AreaChart/AreaChart'
import { BarChart } from '../BarChart/BarChart'
import { MetricsBanner } from '../MetricsBanner/MetricsBanner'
import { UserPoolHoldings } from '../UserPoolHoldings/UserPoolHoldings'
import { REWARDS_DATA, VOLUME_DATA } from './mock'
import './PoolOverview.pcss'

const USDC_TOKEN = {
	src: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png',
	alt: 'USDC Logo',
	label: 'USDC',
} as const

const ARB_CHAIN = {
	src: 'https://api.v2.concero.io/static/chains/42161.svg',
	alt: 'Arbitrum Logo',
	label: 'ARB',
} as const

type PoolOverviewProps = {
	usdBalance: number
	lpBalance: number
	principal: number
	isLoading: boolean
}

export const PoolOverview: FC<PoolOverviewProps> = ({
	usdBalance,
	lpBalance,
	principal,
	isLoading,
}): ReactElement => {
	const [volumeRange, setVolumeRange] = useState(ChartRange.ALL)
	const [rewardsRange, setRewardsRange] = useState(ChartRange.ALL)

	const heading = useMemo(
		() => (
			<div className="pool_overview_content_heading">
				<div className="pool_overview_content_logos">
					<img
						src={USDC_TOKEN.src}
						alt={USDC_TOKEN.alt}
						className="pool_overview_content_heading_token"
						loading="lazy"
						decoding="async"
					/>
					<img
						src={ARB_CHAIN.src}
						alt={ARB_CHAIN.alt}
						className="pool_overview_content_heading_chain"
						loading="lazy"
						decoding="async"
					/>
				</div>
				<span className="pool_overview_heading_text">{`${USDC_TOKEN.label} ${ARB_CHAIN.label}`}</span>
			</div>
		),
		[],
	)

	const metrics = useMemo(() => <MetricsBanner />, [])

	const holdings = useMemo(
		() => (
			<UserPoolHoldings
				usdBalance={105.3}
				lpBalance={0.3455}
				principal={100}
				isLoading={isLoading}
			/>
		),
		[usdBalance, lpBalance, principal, isLoading],
	)

	const volumeTotal = useMemo(
		() => VOLUME_DATA.reduce((sum, d) => sum + d.value, 0),
		[],
	)
	const rewardsTotal = useMemo(
		() => REWARDS_DATA.reduce((sum, d) => sum + d.value, 0),
		[],
	)

	const handleVolumeRange = useCallback((range: ChartRange) => {
		setVolumeRange(range)
	}, [])

	const handleRewardsRange = useCallback((range: ChartRange) => {
		setRewardsRange(range)
	}, [])

	return (
		<div className="pool_overview">
			<div className="pool_overview_content">
				{heading}
				{holdings}
				{metrics}
				<div className="pool_overview_charts">
					<BarChart
						title="TVL"
						total={rewardsTotal}
						data={REWARDS_DATA}
						range={rewardsRange}
						isLoading={false}
						showMenu={false}
						onRangeChange={handleRewardsRange}
						tip={{
							id: 'rewards_tip',
							description: 'Rewards earned by liquidity providers.',
						}}
					/>
					<BarChart
						title="Total Rewards"
						total={rewardsTotal}
						data={REWARDS_DATA}
						range={rewardsRange}
						isLoading={false}
						showMenu={false}
						onRangeChange={handleRewardsRange}
						tip={{
							id: 'rewards_tip',
							description: 'Rewards earned by liquidity providers.',
						}}
					/>
					<AreaChart
						title="Weekly APY"
						total={volumeTotal}
						data={VOLUME_DATA}
						range={volumeRange}
						isLoading={false}
						showMenu={false}
						onRangeChange={handleVolumeRange}
						tip={{
							id: 'volume_tip',
							description: 'Trading volume in this pool.',
						}}
					/>
				</div>
			</div>
		</div>
	)
}
