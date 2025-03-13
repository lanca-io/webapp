import type { FC } from 'react'
import { useFormStore } from '../../../../../store/form/useFormStore'
import { Token, TokenSkeleton } from '../Token/Token'
import { useAccount } from 'wagmi'
import { useGetBalances } from '../../../../../hooks/useGetBalances'

import classNames from './Balance.module.pcss'

export const Balance: FC = () => {
	const { address, isConnected } = useAccount()
	const { srcChain } = useFormStore()
	const { balances, isLoading } = useGetBalances(srcChain?.id)

	const skeletonCount = 3
	const skeletons = Array.from({ length: skeletonCount }).map((_, index) => <TokenSkeleton key={index} />)

	if (!isConnected || !address || (!isLoading && balances.length === 0)) {
		return null
	}

	return (
		<div className={classNames['balance']}>
			<h4 className={classNames['balance-title']}>Your Tokens</h4>
			{isLoading
				? skeletons
				: balances.map(token => (
						<Token key={token.address} token={token} chain={srcChain!} showBalance={true} />
					))}
		</div>
	)
}
