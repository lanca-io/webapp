import { type FC } from 'react'
import type { PopularProps } from './types'
import { Token, TokenSkeleton } from '../Token/Token'
import classNames from './Popular.module.pcss'

export const Popular: FC<PopularProps> = ({ tokens, isLoading }) => {
	const skeletonCount = 15
	const skeletons = Array.from({ length: skeletonCount }).map((_, index) => <TokenSkeleton key={index} />)

	if (!isLoading && tokens.length === 0) {
		return null
	}

	return (
		<div className={classNames['popular']}>
			<h4 className={classNames['popular-title']}>Popular Tokens</h4>
			{tokens.map((token, index) => (
				<Token key={`${token.address}-${index}`} token={token} showBalance={false} />
			))}
			{isLoading && skeletons}
		</div>
	)
}
