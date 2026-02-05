import type { FC } from 'react'
import { useMemo } from 'react'
import { Tag } from '@concero/ui-kit'
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
	const tags = useMemo(
		() =>
			!isLoading && (
				<div className="pool_compact_tags">
					{isActive && (
						<Tag size="m" variant="branded">
							Active
						</Tag>
					)}
					{isFull && (
						<Tag size="m" variant="warning">
							Full
						</Tag>
					)}
				</div>
			),
		[isLoading, isActive, isFull],
	)

	const logos = useMemo(
		() => (
			<div className="pool_compact_heading_logos">
				{isLoading ? (
					<>
						<SkeletonLoader
							width={48}
							height={48}
							className="pool_compact_heading_logo_token"
						/>
						<SkeletonLoader
							width={48}
							height={48}
							className="pool_compact_heading_logo_chain"
						/>
					</>
				) : (
					<>
						<img
							src={USDC_TOKEN.src}
							alt={USDC_TOKEN.alt}
							className="pool_compact_heading_logo_token"
							loading="lazy"
							decoding="async"
						/>
						<img
							src={ARB_CHAIN.src}
							alt={ARB_CHAIN.alt}
							className="pool_compact_heading_logo_chain"
							loading="lazy"
							decoding="async"
						/>
					</>
				)}
			</div>
		),
		[isLoading],
	)

	const description = useMemo(
		() => (
			<div className="pool_compact_heading_description">
				{isLoading ? (
					<SkeletonLoader width={116} height={28} />
				) : (
					<>
						<span className="pool_compact_title_token">{USDC_TOKEN.label}</span>
						<span className="pool_compact_title_chain">{ARB_CHAIN.label}</span>
					</>
				)}
			</div>
		),
		[isLoading],
	)

	return (
		<div className="pool_compact_heading">
			{tags}
			<div className="pool_compact_heading_content">
				{logos}
				{description}
			</div>
		</div>
	)
}
