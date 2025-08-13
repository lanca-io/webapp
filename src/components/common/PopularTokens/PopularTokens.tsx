import type { ExtendedToken } from '../../../store/tokens/types'
import { memo, useCallback } from 'react'
import { Token } from '../Token/Token'
import { TokenSkeleton } from '../Token/TokenSkeleton'
import { useBalancesStore } from '../../../store/balances/useBalancesStore'
import './PopularTokens.pcss'

type PopularTokensProps = {
	tokens: ExtendedToken[]
	isLoading: boolean
	onTokenSelect: (token: ExtendedToken) => void
}

export const PopularTokens = memo(({ tokens, isLoading, onTokenSelect }: PopularTokensProps): JSX.Element | null => {
	const { balances } = useBalancesStore()

	const filteredTokens = tokens.filter(
		token =>
			!balances.some(
				balance =>
					balance.address === token.address &&
					Number(balance.chain_id) === Number(token.chain_id) &&
					Number(balance.balance) > 0,
			),
	)

	const handleSelect = useCallback(
		(token: ExtendedToken) => {
			return () => onTokenSelect(token)
		},
		[onTokenSelect],
	)

	if (!isLoading && filteredTokens.length === 0) return null

	return (
		<div className="popular_tokens" role="region" aria-label="Popular tokens">
			<h4 className="popular_tokens_title">Popular Tokens</h4>
			{filteredTokens.map(token => (
				<Token
					key={`${token.address}-${token.chain_id}`}
					token={token}
					showBalance={false}
					onClick={handleSelect(token)}
				/>
			))}
			{isLoading && Array.from({ length: 15 }).map((_, i) => <TokenSkeleton key={i} showBalance={false} />)}
		</div>
	)
})
