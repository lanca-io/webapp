import classNames from './TokenBadge.module.pcss'

interface TokenBadgeProps {
	tokenLogoSrc: string
	chainLogoSrc?: string
	size?: 'xs' | 's' | 'm' | 'l' | 'xl'
}

export const TokenBadge = ({ tokenLogoSrc, chainLogoSrc, size = 'm' }: TokenBadgeProps) => {
	return (
		<div className={classNames.container}>
			<img src={tokenLogoSrc} className={`${classNames.token} ${classNames[size]}`} alt="Token image" />
			{chainLogoSrc && <img src={chainLogoSrc} className={classNames.chain} alt="Chain image" />}
		</div>
	)
}
