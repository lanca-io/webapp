import type { FC } from 'react'
import { useMemo } from 'react'
import { Tag } from '@concero/ui-kit'
import { InfoTip } from '../../InfoTip'
import { SkeletonLoader } from '../../SkeletonLoader'
import './Heading.pcss'

type PoolHeadingProps = {
	isLoading: boolean
	isActive: boolean
	isFull: boolean
}

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

export const Heading: FC<PoolHeadingProps> = ({
	isLoading,
	isActive,
	isFull,
}) => {
	const logos = useMemo(
		() => (
			<div className="pool_extended_heading_logos">
				{isLoading ? (
					<>
						<SkeletonLoader
							width={40}
							height={40}
							className="pool_extended_heading_logo_token"
						/>
						<SkeletonLoader
							width={40}
							height={40}
							className="pool_extended_heading_logo_chain"
						/>
					</>
				) : (
					<>
						<img
							src={USDC_TOKEN.src}
							alt={USDC_TOKEN.alt}
							className="pool_extended_heading_logo_token"
							loading="lazy"
							decoding="async"
						/>
						<img
							src={ARB_CHAIN.src}
							alt={ARB_CHAIN.alt}
							className="pool_extended_heading_logo_chain"
							loading="lazy"
							decoding="async"
						/>
					</>
				)}
			</div>
		),
		[isLoading],
	)

	const titles = useMemo(
		() => (
			<div className="pool_extended_title_container">
				{isLoading ? (
					<SkeletonLoader width={154} height={28} />
				) : (
					<>
						<span className="pool_extended_title_token">
							{USDC_TOKEN.label}
						</span>
						<span className="pool_extended_title_chain">{ARB_CHAIN.label}</span>
					</>
				)}
			</div>
		),
		[isLoading],
	)

	const indicators = useMemo(
		() =>
			!isLoading && (
				<div className="pool_extended_indicators">
					{isActive && (
						<Tag size="s" variant="branded">
							Active
						</Tag>
					)}
					{isFull && (
						<>
							<Tag size="s" variant="warning">
								Full
							</Tag>
							<InfoTip
								id="pool_full_info_tip"
								description="This pool has reached its current capacity. You can still withdraw, but new deposits are temporarily disabled."
							/>
						</>
					)}
				</div>
			),
		[isLoading, isActive, isFull],
	)

	return (
		<div className="pool_extended_heading">
			{logos}
			<div className="pool_extended_heading_description">
				{titles}
				{indicators}
			</div>
		</div>
	)
}
