import type { FC, ReactElement } from 'react'
import { useMemo } from 'react'
import { RangeChart } from '../RangeChart/RangeChart'
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
				usdBalance={usdBalance}
				lpBalance={lpBalance}
				principal={principal}
				isLoading={isLoading}
			/>
		),
		[usdBalance, lpBalance, principal, isLoading],
	)

	return (
		<div className="pool_overview">
			<div className="pool_overview_content">
				{heading}
				{holdings}
				{metrics}
				<div className="pool_overview_charts">
					{/* 1st: RangedChart - $5K / $10K */}
					<RangeChart
						title="TVL"
						description="Total Value Locked"
						data={{ current: 5000, target: 10000 }}
						denomination="$"
						isLoading={false}
					/>
					{/* 2nd: Rewards */}
					<BarChart
						data={REWARDS_DATA}
						title="Rewards"
						description="Rewards earned by liquidity providers"
						total={1234.56}
						settings={{
							isLoading: false,
							isAdvanced: false,
							denomination: '$',
						}}
					/>
					{/* 3rd: Volume */}
					<AreaChart
						data={VOLUME_DATA}
						title="Volume"
						description="Trading volume in this pool"
						total={15000}
						settings={{
							isLoading: false,
							isAdvanced: false,
							denomination: '$',
						}}
					/>
				</div>
			</div>
		</div>
	)
}
