import type { FC } from 'react'
import type { ExtendedToken } from '../../store/tokens/types'
import { useMemo } from 'react'
import { Token } from '../Token/Token'
import './SearchedTokens.pcss'

export type SearchedTokensProps = {
	tokens: ExtendedToken[]
	isLoading: boolean
	onTokenSelect: (token: ExtendedToken) => void
}

export const SearchedTokens: FC<SearchedTokensProps> = ({ tokens, isLoading, onTokenSelect }) => {
	const loadingTokens = useMemo(
		() =>
			Array.from({ length: 4 }).map((_, index) => ({
				address: `loading-${index}`,
				chain_id: '',
				symbol: '',
				name: '',
				decimals: 18,
				logoURI: '',
				is_popular: false,
				coinGeckoId: '',
				priceUsd: 0,
			})),
		[],
	)

	if (!isLoading && tokens.length === 0) {
		return null
	}

	return (
		<div className="searched_tokens">
			<h4 className="searched_tokens_title">Tokens</h4>

			{isLoading
				? loadingTokens.map((token, index) => (
						<Token key={`loading-${index}`} token={token} showBalance={false} isLoading={true} />
					))
				: tokens.map(token => (
						<Token
							key={`${token.address}-${token.chain_id}`}
							token={token}
							showBalance={false}
							onClick={() => onTokenSelect(token)}
							isLoading={false}
						/>
					))}
		</div>
	)
}
