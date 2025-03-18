import type { FC } from 'react'
import type { SearchTokensProps } from './types'
import { Token, TokenSkeleton } from '../Token/Token'

import classNames from './SearchTokens.module.pcss'

export const SearchTokens: FC<SearchTokensProps> = ({ tokens, isLoading, onTokenSelect }) => {
	const skeletonCount = 4
	const skeletons = Array.from({ length: skeletonCount }).map((_, index) => <TokenSkeleton key={index} />)

	if (!isLoading && tokens.length === 0) {
		return null
	}

	return (
		<div className={classNames['search-tokens']}>
			<h4 className={classNames['search-tokens__title']}>Tokens</h4>
			{isLoading
				? skeletons
				: tokens.map(token => (
						<Token
							key={`${token.address}-${token.chain_id}`}
							token={token}
							onClick={() => onTokenSelect(token)}
						/>
					))}
		</div>
	)
}
