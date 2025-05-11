import type { ExtendedToken } from '../../store/tokens/types'
import type { ILancaChain } from '@lanca/sdk'
import { memo, useState, useCallback } from 'react'
import { Token } from '../Token/Token'
import { ExpandButton } from '../ExpandButton/ExpandButton'
import { TokenSkeleton } from '../Token/TokenSkeleton'
import { useAccount } from 'wagmi'
import { useGetBalances } from '../../hooks/useGetBalances'
import './TokenBalances.pcss'

type BalanceProps = {
	chain: ILancaChain | null
	items: number
	onTokenSelect: (token: ExtendedToken) => void
}

export const TokenBalances = memo(({ chain, items, onTokenSelect }: BalanceProps): JSX.Element | null => {
	const { address, isConnected } = useAccount()
	const { balances, isLoading } = useGetBalances(chain?.id)
	const [shown, setShown] = useState(items)

	const handleSelect = useCallback(
		(token: ExtendedToken) => {
			return () => onTokenSelect(token)
		},
		[onTokenSelect],
	)

	const toggleExpand = useCallback(() => {
		setShown(prev => (prev === items ? balances.length : items))
	}, [balances.length, items])

	if (!isConnected || !address) return null
	if (!isLoading && balances.length === 0) return null

	const canExpand = balances.length > items
	const expanded = shown >= balances.length

	return (
		<div className="token_balances" role="region" aria-label="Your tokens">
			<h2 className="token_balances_title">Your Tokens</h2>
			{isLoading
				? Array.from({ length: items }).map((_, i) => <TokenSkeleton key={i} />)
				: balances
						.slice(0, shown)
						.map(token => (
							<Token
								key={`${token.address}-${token.chain_id}`}
								token={token}
								showBalance
								onClick={handleSelect(token)}
							/>
						))}
			{canExpand && (
				<ExpandButton
					isExpanded={expanded}
					onToggle={toggleExpand}
					aria-label={expanded ? 'Show fewer tokens' : 'Show all tokens'}
				/>
			)}
		</div>
	)
})
