import classNames from './Badge.module.pcss'

interface TokenBadgeProps {
	tokenLogoSrc: string | null | undefined
	chainLogoSrc?: string | null | undefined
	size?: 'xs' | 's' | 'm' | 'l' | 'xl'
	borderSmall?: boolean
}

export const Badge = ({ tokenLogoSrc, chainLogoSrc, borderSmall, size = 'm' }: TokenBadgeProps) => {
	return (
		<div className={classNames.container}>
			<img
				src={tokenLogoSrc}
				className={`${classNames.token} ${classNames[size]} ${borderSmall ? classNames.borderSmall : ''}`}
				alt="Token image"
			/>
			{chainLogoSrc && <img src={chainLogoSrc} className={classNames.chain} alt="Chain image" />}
		</div>
	)
}
