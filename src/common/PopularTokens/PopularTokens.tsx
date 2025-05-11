import type { ExtendedToken } from '../../store/tokens/types'
import { memo, useCallback } from 'react'
import { Token } from '../Token/Token'
import { TokenSkeleton } from '../Token/TokenSkeleton'
import './PopularTokens.pcss'

type PopularTokensProps = {
	tokens: ExtendedToken[]
	isLoading: boolean
	onTokenSelect: (token: ExtendedToken) => void
}

export const PopularTokens = memo(({ tokens, isLoading, onTokenSelect }: PopularTokensProps): JSX.Element | null => {
	const handleSelect = useCallback(
		(token: ExtendedToken) => {
			return () => onTokenSelect(token)
		},
		[onTokenSelect],
	)

	if (!isLoading && tokens.length === 0) return null

	return (
		<div className="popular_tokens" role="region" aria-label="Popular tokens">
			<h4 className="popular_tokens_title">Popular Tokens</h4>
			{tokens.map(token => (
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
