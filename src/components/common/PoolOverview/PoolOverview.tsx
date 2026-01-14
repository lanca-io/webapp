import type { FC, ReactElement } from 'react'
import { MetricsBanner } from '../MetricsBanner/MetricsBanner'
import { useMemo } from 'react'
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

export const PoolOverview: FC = (): ReactElement => {
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
	return (
		<div className="pool_overview">
			<div className="pool_overview_content">
				{heading}
				{metrics}
			</div>
		</div>
	)
}
