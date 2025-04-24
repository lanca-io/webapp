import type { FC } from 'react'
import type { ExtendedToken } from '../../store/tokens/types'
import { SkeletonLoader } from '../../components/layout/SkeletonLoader/SkeletonLoader'
import { memo } from 'react'
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

export const Token: FC<TokenProps> = memo(({ token, showBalance = false, onClick, isLoading = false }) => {
	return (
		<div className="token" onClick={!isLoading ? onClick : undefined}>
			<div className="token_content">
				{isLoading ? (
					<SkeletonLoader width={32} height={32} />
				) : (
					<Badge tokenLogoSrc={token.logoURI} chainLogoSrc={token.chainLogoURI || ''} size="l" />
				)}
				<div className="token_description">
					{isLoading ? (
						<SkeletonLoader width={29} height={17} />
					) : (
						<h4 className="token_symbol">{truncate(token.symbol, 20)}</h4>
					)}
					<div className="token_information">
						{isLoading ? (
							<SkeletonLoader width={25} height={17} />
						) : (
							<>
								<p className="token_name">{truncate(token.name, 15)}</p>
								<p className="token_address">{`(${truncateAddress(token.address)})`}</p>
							</>
						)}
					</div>
				</div>
			</div>
			{showBalance &&
				(isLoading ? (
					<div className="token_price_container">
						<SkeletonLoader width={30} height={16} />
					</div>
				) : (
					<Balance balance={token.balance || '0'} decimals={token.decimals} price={token.priceUsd} />
				))}
		</div>
	)
})
