import { type FC, useState, useEffect } from 'react'
import { useFormStore } from '../../../../../store/form/useFormStore'
import { Token, TokenSkeleton } from '../Token/Token'
import { useAccount } from 'wagmi'
import { useGetBalances } from '../../../../../hooks/useGetBalances'
import { BalanceProps } from '../Balance/types'
import { View } from '../../View/View'
import { useTokensStore } from '../../../../../store/tokens/useTokensStore'

import classNames from './SearchTokens.module.pcss'

export const SearchTokens: FC<BalanceProps> = ({ direction }) => {
	const { address, isConnected } = useAccount()
	const { srcChain, dstChain } = useFormStore()
	const activeChain = direction === 'from' ? srcChain : dstChain
	const { balances, isLoading } = useGetBalances(activeChain?.id)
	const { srcSearchedTokens, dstSearchedTokens, allSearchedTokens, srcSearchValue, dstSearchValue, allSearchValue } =
		useTokensStore()
	const [visibleCount, setVisibleCount] = useState<number>(4)
	const increment = 4

	const searchValue = direction === 'from' ? srcSearchValue : dstSearchValue || allSearchValue
	const searchedTokens = direction === 'from' ? srcSearchedTokens : dstSearchedTokens || allSearchedTokens

	useEffect(() => {
		setVisibleCount(4)
	}, [searchValue])

	const skeletonCount = 4
	const skeletons = Array.from({ length: skeletonCount }).map((_, index) => <TokenSkeleton key={index} />)

	if (!isConnected || !address || (!isLoading && balances.length === 0 && searchedTokens.length === 0)) {
		return null
	}

	const handleExpand = () => {
		setVisibleCount(prevCount => Math.min(prevCount + increment, balances.length + searchedTokens.length))
	}

	const handleShowLess = () => {
		setVisibleCount(4)
	}

	return (
		<div className={classNames['balance']}>
			<h4 className={classNames['balance-title']}>Tokens</h4>
			{isLoading
				? skeletons
				: searchedTokens.length > 0
					? searchedTokens
							.slice(0, visibleCount)
							.map(token => (
								<Token key={`${token.address}-${token.chain_id}`} token={token} showBalance={true} />
							))
					: balances
							.slice(0, visibleCount)
							.map(token => (
								<Token key={`${token.address}-${token.chain_id}`} token={token} showBalance={true} />
							))}
			{(balances.length > 4 || searchedTokens.length > 4) && (
				<View
					isExpanded={visibleCount >= balances.length + searchedTokens.length}
					handleExpand={handleExpand}
					handleShowLess={handleShowLess}
				/>
			)}
		</div>
	)
}
