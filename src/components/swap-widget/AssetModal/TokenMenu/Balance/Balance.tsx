import type { FC } from 'react'
import { useState, useCallback, useMemo } from 'react'
import { Token, TokenSkeleton } from '../Token/Token'
import { useAccount } from 'wagmi'
import { useGetBalances } from '../../../../../hooks/useGetBalances'
import { BalanceProps } from './types'
import { View } from '../../View/View'

import classNames from './Balance.module.pcss'

export const Balance: FC<BalanceProps> = ({ chain, items, onTokenSelect }) => {
	const [visibleCount, setVisibleCount] = useState<number>(items)

	const { address, isConnected } = useAccount()
	const { balances, isLoading } = useGetBalances(chain?.id)

	const skeletons = useMemo(() => {
		return Array.from({ length: items }).map((_, index) => <TokenSkeleton key={index} />)
	}, [items])

	const handleExpand = useCallback(() => {
		setVisibleCount(prevCount => Math.min(prevCount + items, balances.length))
	}, [items, balances.length])

	const handleShowLess = useCallback(() => {
		setVisibleCount(items)
	}, [items])

	if (!isConnected || !address || (!isLoading && balances.length === 0)) {
		return null
	}

	return (
		<div className={classNames['balance']}>
			<h4 className={classNames['balance-title']}>Your Tokens</h4>
			{isLoading
				? skeletons
				: balances
						.slice(0, visibleCount)
						.map(token => (
							<Token
								key={`${token.address}-${token.chain_id}`}
								token={token}
								showBalance={true}
								onClick={() => onTokenSelect(token)}
							/>
						))}
			{balances.length > items && (
				<View
					isExpanded={visibleCount >= balances.length}
					handleExpand={handleExpand}
					handleShowLess={handleShowLess}
				/>
			)}
		</div>
	)
}
