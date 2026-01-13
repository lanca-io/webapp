import type { FC } from 'react'
import { Tag } from '@concero/ui-kit'
import './Heading.pcss'

type Logo = {
	src: string
	alt: string
}

type PoolHeadingProps = {
	token: Logo
	chain: Logo
	isActive: boolean
	isFull: boolean
	tokenLabel?: string
	chainLabel?: string
}

export const Heading: FC<PoolHeadingProps> = ({
	token,
	chain,
	isActive,
	isFull,
	tokenLabel,
	chainLabel,
}) => (
	<div className="pool_compact_heading">
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
		<div className="pool_compact_heading_content">
			<div className="pool_compact_heading_logos">
				<img
					src={token.src}
					alt={token.alt}
					className="pool_compact_heading_logo_token"
				/>
				<img
					src={chain.src}
					alt={chain.alt}
					className="pool_compact_heading_logo_chain"
				/>
			</div>
			<div className="pool_compact_heading_description">
				<span className="pool_compact_title_token">{tokenLabel}</span>
				<span className="pool_compact_title_chain">{chainLabel}</span>
			</div>
		</div>
	</div>
)
