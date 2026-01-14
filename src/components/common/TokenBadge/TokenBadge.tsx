import './TokenBadge.pcss'

interface TokenBadgeProps {
	tokenLogoSrc: string
	chainLogoSrc?: string | null | undefined
	size?: 'xs' | 's' | 'm' | 'l' | 'xl'
	borderSmall?: boolean
	borderMedium?: boolean
}

const placeholder =
	'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="gray"%3E%3Crect width="100%" height="100%"%3E%3C/rect%3E%3C/svg%3E'

export const TokenBadge = ({
	tokenLogoSrc,
	chainLogoSrc,
	borderSmall,
	borderMedium,
	size = 'm',
}: TokenBadgeProps) => {
	const handleImgError = (e: any) => {
		e.target.src = placeholder
	}

	return (
		<div className="token_badge_container">
			<img
				src={tokenLogoSrc || ''}
				className={`token_badge_token token_badge_${size} ${borderSmall ? 'token_badge_border_small' : ''} ${borderMedium ? 'token_badge_border_medium' : ''}`}
				alt="Token image"
				onError={handleImgError}
			/>
			{chainLogoSrc && (
				<img
					src={chainLogoSrc}
					className="token_badge_chain"
					alt="Chain image"
				/>
			)}
		</div>
	)
}
