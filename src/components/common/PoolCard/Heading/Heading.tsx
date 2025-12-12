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

export const Heading = ({
	token,
	chain,
	isActive,
	isFull,
	tokenLabel,
	chainLabel,
}: PoolHeadingProps): JSX.Element => {
	return (
		<div className="pool_card_heading">
			<div className="pool_card_heading_logos">
				<img
					src={token.src}
					alt={token.alt}
					className="pool_card_heading_logo_token"
				/>
				<img
					src={chain.src}
					alt={chain.alt}
					className="pool_card_heading_logo_chain"
				/>
			</div>
			<div className="pool_card_heading_description">
				<div className="pool_card_title_container">
					<span className="pool_card_title_token">{tokenLabel}</span>
					<span className="pool_card_title_chain">{chainLabel}</span>
				</div>
				<div className="pool_card_indicators">
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
						</>
					)}
				</div>
			</div>
		</div>
	)
}
