import type { FC } from 'react'
import type { ExtendedToken } from '../../store/tokens/types'
import { useMemo, useCallback, memo } from 'react'
import { TokenSkeleton } from '../Token/TokenSkeleton'
import { Token } from '../Token/Token'
import './PopularTokens.pcss'

type TokensProps = {
	tokens: ExtendedToken[]
	isLoading: boolean
	onTokenSelect: (token: ExtendedToken) => void
}

export const PopularTokens: FC<TokensProps> = memo(({ tokens, isLoading, onTokenSelect }) => {
	const skeletons = useMemo(() => {
		const count = 15
		return Array.from({ length: count }).map((_, i) => <TokenSkeleton key={i} showBalance={false} />)
	}, [])

	const handleSelect = useCallback((token: ExtendedToken) => () => onTokenSelect(token), [onTokenSelect])

	const tokenList = useMemo(
		() =>
			tokens.map((token, i) => (
				<Token key={`${token.address}-${i}`} token={token} showBalance={false} onClick={handleSelect(token)} />
			)),
		[tokens, handleSelect],
	)

	if (!isLoading && tokens.length === 0) {
		return null
	}

	return (
		<div className="popular_tokens">
			<h4 className="popular_tokens_title">Popular Tokens</h4>
			{tokenList}
			{isLoading && skeletons}
		</div>
	)
})
