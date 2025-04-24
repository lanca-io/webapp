import type { FC } from 'react'
import { useState, useCallback, useMemo } from 'react'
import { Token, TokenSkeleton } from '../Token/Token'
import { useAccount } from 'wagmi'
import { useGetBalances } from '../../../../../hooks/useGetBalances'
import { BalanceProps } from './types'
import { ExpandButton } from '../../../../../common/ExpandButton/ExpandButton'

import classNames from './Balance.module.pcss'

export const Balance: FC<BalanceProps> = ({ chain, items, onTokenSelect }) => {
	const [visibleCount, setVisibleCount] = useState<number>(items)

	const { address, isConnected } = useAccount()
	const { balances, isLoading } = useGetBalances(chain?.id)

	const skeletons = useMemo(() => {
		return Array.from({ length: items }).map((_, index) => <TokenSkeleton key={index} />)
	}, [items])

	const handleToggleExpand = useCallback(
		(expanded: boolean) => {
			setVisibleCount(expanded ? balances.length : items)
		},
		[items, balances.length],
	)

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
				<ExpandButton isExpanded={visibleCount >= balances.length} onToggle={handleToggleExpand} />
			)}
		</div>
	)
}
