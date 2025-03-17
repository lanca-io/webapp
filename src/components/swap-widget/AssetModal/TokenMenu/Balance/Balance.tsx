import { type FC, useState } from 'react'
import { useFormStore } from '../../../../../store/form/useFormStore'
import { Token, TokenSkeleton } from '../Token/Token'
import { useAccount } from 'wagmi'
import { useGetBalances } from '../../../../../hooks/useGetBalances'
import classNames from './Balance.module.pcss'
import { BalanceProps } from './types'
import { View } from '../../View/View'

export const Balance: FC<BalanceProps> = ({ direction }) => {
	const { address, isConnected } = useAccount()
	const { srcChain, dstChain } = useFormStore()
	const activeChain = direction === 'from' ? srcChain : dstChain
	const { balances, isLoading } = useGetBalances(activeChain?.id)
	const [visibleCount, setVisibleCount] = useState<number>(4)
	const increment = 4

	const skeletonCount = 4
	const skeletons = Array.from({ length: skeletonCount }).map((_, index) => <TokenSkeleton key={index} />)

	if (!isConnected || !address || (!isLoading && balances.length === 0)) {
		return null
	}

	const handleExpand = () => {
		setVisibleCount(prevCount => Math.min(prevCount + increment, balances.length))
	}

	const handleShowLess = () => {
		setVisibleCount(4)
	}

	return (
		<div className={classNames['balance']}>
			<h4 className={classNames['balance-title']}>Your Tokens</h4>
			{isLoading
				? skeletons
				: balances
						.slice(0, visibleCount)
						.map(token => (
							<Token key={`${token.address}-${token.chain_id}`} token={token} showBalance={true} />
						))}
			{balances.length > 4 && (
				<View
					isExpanded={visibleCount >= balances.length}
					handleExpand={handleExpand}
					handleShowLess={handleShowLess}
				/>
			)}
		</div>
	)
}
