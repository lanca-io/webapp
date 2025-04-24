import { type FC, useMemo } from 'react'
import type { ExtendedToken } from '../../store/tokens/types'
import { Token } from '../Token/Token'
import './PopularTokens.pcss'

export type PopularTokensProps = {
	tokens: ExtendedToken[]
	isLoading: boolean
	onTokenSelect: (token: ExtendedToken) => void
}

export const PopularTokens: FC<PopularTokensProps> = ({ tokens, isLoading, onTokenSelect }) => {
	const loadingTokens = useMemo(
		() =>
			Array.from({ length: 15 }).map(
				(_, index) =>
					({
						address: `loading-${index}`,
						chain_id: '',
						symbol: '',
						name: '',
						decimals: 18,
						logoURI: '',
					}) as ExtendedToken,
			),
		[],
	)

	if (!isLoading && tokens.length === 0) {
		return null
	}

	return (
		<div className="popular_tokens_container">
			<h4 className="popular_tokens_title">Popular Tokens</h4>
			{isLoading
				? loadingTokens.map((token, index) => (
						<Token key={`loading-${index}`} token={token} showBalance={false} isLoading={true} />
					))
				: tokens.map((token, index) => (
						<Token
							key={`${token.address}-${index}`}
							token={token}
							showBalance={false}
							onClick={() => onTokenSelect(token)}
							isLoading={false}
						/>
					))}
		</div>
	)
}
