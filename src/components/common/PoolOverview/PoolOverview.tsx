import type { FC, ReactElement } from 'react'
import { useMemo } from 'react'
import { RangeChart } from '../RangeChart/RangeChart'
import { AreaChart } from '../AreaChart/AreaChart'
import { BarChart } from '../BarChart/BarChart'
import { MetricsBanner } from '../MetricsBanner/MetricsBanner'
import { UserPoolHoldings } from '../UserPoolHoldings/UserPoolHoldings'
import { REWARDS_DATA, VOLUME_DATA } from './mock'
import { usePoolsPositions } from '@/store/pools-positions/usePoolsPositionsStore'
import { ActionsTable } from '../ActionsTable/ActionsTable'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
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
	principal,
	isLoading,
}): ReactElement => {
	const { usd, lp } = usePoolsPositions()
	const { cap, tvl } = usePoolsDataStore()
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
			<UserPoolHoldings lpBalance={lp} principal={0} isLoading={isLoading} />
		),
		[usd, lp, principal, isLoading],
	)

	return (
		<div className="pool_overview">
			<div className="pool_overview_content">
				{heading}
				{holdings}
				{metrics}
				<div className="pool_overview_charts">
					<RangeChart
						title="TVL"
						description="Total Value Locked"
						data={{ current: tvl, target: cap }}
						leftDenomination="$"
						isLoading={false}
					/>
					<BarChart
						data={REWARDS_DATA}
						title="Rewards"
						description="Rewards earned by liquidity providers"
						total={'-'}
						settings={{
							isLoading: false,
							isAdvanced: false,
							leftDenomination: '$',
						}}
					/>
					<AreaChart
						data={VOLUME_DATA}
						title="Weekly APY"
						description="Weekly Annual Percentage Yield"
						total={'-'}
						settings={{
							isLoading: false,
							isAdvanced: false,
							leftDenomination: '%',
						}}
					/>
				</div>
				<ActionsTable />
			</div>
		</div>
	)
}
