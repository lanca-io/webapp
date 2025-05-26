import type { ExtendedToken } from '../../../store/tokens/types'
import type { Address } from 'viem'
import { memo, useCallback, useMemo } from 'react'
import { Badge } from '../../layout/Badge/Badge'
import { Balance } from '../Balance/Balance'
import { truncate, truncateAddress } from '../../../utils/new/truncate'
import { LinkIcon } from '../../../assets/icons/LinkIcon'
import { useChainsStore } from '../../../store/chains/useChainsStore'
import { NativeInfo } from './NativeInfo/NativeInfo'
import { isNative } from '@lanca/sdk'
import './Token.pcss'

type TokenProps = {
	token: ExtendedToken
	showBalance?: boolean
	onClick?: () => void
	isLoading?: boolean
}

export const Token = memo(({ token, showBalance = false, onClick }: TokenProps): JSX.Element => {
	const { chains } = useChainsStore()

	const explorer = useMemo(
		() => chains.find(chain => chain.id === token.chain_id)?.explorerURI,
		[chains, token.chain_id],
	)

	const native = useMemo(() => isNative(token.address as Address), [token.address])

	const [symbol, name, address] = useMemo(
		() => [truncate(token.symbol, 20), truncate(token.name, 15), truncateAddress(token.address)],
		[token.symbol, token.name, token.address],
	)

	const explorerUrl = useMemo(
		() => (explorer ? `${explorer}/token/${token.address}` : null),
		[explorer, token.address],
	)

	const handleClick = useCallback(() => onClick?.(), [onClick])
	const handleLinkClick = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])

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
					<div className="token_symbols">
						<h4 className="token_symbol">{symbol}</h4>
						<NativeInfo isVisible={native} />
					</div>
					<div className="token_information">
						<p className="token_name">{name}</p>
						{explorerUrl && (
							<a
								href={explorerUrl}
								target="_blank"
								rel="noopener noreferrer"
								onClick={handleLinkClick}
								className="token_address_container"
							>
								<p className="token_address">{`(${address})`}</p>
								<LinkIcon />
							</a>
						)}
					</div>
				</div>
			</div>
			{balance}
		</div>
	)
})
