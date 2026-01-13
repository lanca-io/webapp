import type { FC } from 'react'
import { Tag } from '@concero/ui-kit'
import { InfoTip } from '../../InfoTip'
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
	<div className="pool_extended_heading">
		<div className="pool_extended_heading_logos">
			<img
				src={token.src}
				alt={token.alt}
				className="pool_extended_heading_logo_token"
			/>
			<img
				src={chain.src}
				alt={chain.alt}
				className="pool_extended_heading_logo_chain"
			/>
		</div>
		<div className="pool_extended_heading_description">
			<div className="pool_extended_title_container">
				<span className="pool_extended_title_token">{tokenLabel}</span>
				<span className="pool_extended_title_chain">{chainLabel}</span>
			</div>
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
		</div>
	</div>
)
