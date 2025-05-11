import type { ExtendedToken } from '../../store/tokens/types'
import { memo, useCallback, useMemo } from 'react'
import { Badge } from '../../components/layout/Badge/Badge'
import { Balance } from '../Balance/Balance'
import { truncate, truncateAddress } from '../../utils/new/truncate'
import './Token.pcss'

type TokenProps = {
	token: ExtendedToken
	showBalance?: boolean
	onClick?: () => void
	isLoading?: boolean
}

export const Token = memo(({ token, showBalance = false, onClick }: TokenProps): JSX.Element => {
	const symbol = truncate(token.symbol, 20)
	const name = truncate(token.name, 15)
	const address = truncateAddress(token.address)

	const handleClick = useCallback(() => {
		if (onClick) onClick()
	}, [onClick])

	const badge = useMemo(
		() => <Badge tokenLogoSrc={token.logoURI} chainLogoSrc={token.chainLogoURI || ''} size="l" />,
		[token.logoURI, token.chainLogoURI],
	)

	const balance = useMemo(
		() =>
			showBalance ? (
				<Balance balance={token.balance || '0'} decimals={token.decimals} price={token.priceUsd} />
			) : null,
		[showBalance, token.balance, token.decimals, token.priceUsd],
	)

	return (
		<div className="token" onClick={handleClick}>
			<div className="token_content">
				{badge}
				<div className="token_description">
					<h4 className="token_symbol">{symbol}</h4>
					<div className="token_information">
						<p className="token_name">{name}</p>
						<p className="token_address">{`(${address})`}</p>
					</div>
				</div>
			</div>
			{balance}
		</div>
	)
})
