import type { FC } from 'react'
import type { ExtendedToken } from '../../store/tokens/types'
import { useMemo, useCallback, memo } from 'react'
import { Token } from '../Token/Token'
import { TokenSkeleton } from '../Token/TokenSkeleton'
import './SearchedTokens.pcss'

type TokensProps = {
	tokens: ExtendedToken[]
	isLoading: boolean
	onTokenSelect: (token: ExtendedToken) => void
}

export const SearchedTokens: FC<TokensProps> = memo(({ tokens, isLoading, onTokenSelect }) => {
	const skeletons = useMemo(() => {
		const count = 4
		return Array.from({ length: count }).map((_, i) => <TokenSkeleton key={i} showBalance={false} />)
	}, [])

	const handleSelect = useCallback((token: ExtendedToken) => () => onTokenSelect(token), [onTokenSelect])

	const tokenList = useMemo(
		() =>
			tokens.map(token => (
				<Token
					key={`${token.address}-${token.chain_id}`}
					token={token}
					showBalance={false}
					onClick={handleSelect(token)}
					isLoading={false}
				/>
			)),
		[tokens, handleSelect],
	)

	if (!isLoading && tokens.length === 0) {
		return null
	}

	return (
		<div className="searched_tokens">
			<h4 className="searched_tokens_title">Tokens</h4>
			{isLoading ? skeletons : tokenList}
		</div>
	)
})
