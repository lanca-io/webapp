import type { FC } from 'react'
import type { TokenProps, TokenBalancesProps } from './types'
import { Badge } from '../../../../layout/Badge/Badge'
import { truncate, truncateAddress } from '../../../../../utils/new/truncate'
import { format } from '../../../../../utils/new/format'
import { formatTokenAmount } from '../../../../../utils/new/tokens'
import { SkeletonLoader } from '../../../../layout/SkeletonLoader/SkeletonLoader'

import classNames from './Token.module.pcss'

const TokenBalances: FC<TokenBalancesProps> = ({ balance, decimals = 18, price }) => {
	const tokenBalance = formatTokenAmount(balance, decimals)
	const tokenValue = price ? (price * Number(tokenBalance)).toFixed(3) : null

	return (
		<div className={classNames['token-price-container']}>
			<p className={classNames['token-balance']}>{format(Number(tokenBalance), 3)}</p>
			{tokenValue && <p className={classNames['token-price-usd']}>${tokenValue}</p>}
		</div>
	)
}

export const Token: FC<TokenProps> = ({ token, showBalance = false, onClick }) => {
	const { name, symbol, address, balance, priceUsd: price, logoURI: tokenLogo, decimals, chainLogoURI } = token

	return (
		<div className={classNames['token']} onClick={onClick}>
			<div className={classNames['token-content']}>
				<Badge tokenLogoSrc={tokenLogo} chainLogoSrc={chainLogoURI || ''} size="l" />
				<div className={classNames['token-description']}>
					<h4 className={classNames['token-symbol']}>{truncate(symbol, 20)}</h4>
					<div className={classNames['token-information']}>
						<p className={classNames['token-name']}>{truncate(name, 15)}</p>
						<p className={classNames['token-address']}>{`(${truncateAddress(address)})`}</p>
					</div>
				</div>
			</div>
			{showBalance && <TokenBalances balance={balance || '0'} decimals={decimals} price={price} />}
		</div>
	)
}

export const TokenSkeleton: FC = () => {
	return (
		<div className={classNames['token']}>
			<div className={classNames['token-content']}>
				<SkeletonLoader width={32} height={32} />
				<div className={classNames['token-description']}>
					<SkeletonLoader width={29} height={17} />
					<div className={classNames['token-information']}>
						<SkeletonLoader width={25} height={17} />
					</div>
				</div>
			</div>
			<div className={classNames['token-price-container']}>
				<SkeletonLoader width={30} height={16} />
			</div>
		</div>
	)
}
