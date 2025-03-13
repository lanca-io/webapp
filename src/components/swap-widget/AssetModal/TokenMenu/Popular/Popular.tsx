import type { FC } from 'react'
import { useFormStore } from '../../../../../store/form/useFormStore'
import { Token, TokenSkeleton } from '../Token/Token'
import { useTokensStore } from '../../../../../store/tokens/useTokensStore'
import classNames from './Popular.module.pcss'

export const Popular: FC = () => {
	const { srcChain } = useFormStore()
	const { srcTokens, srcTokensLoading } = useTokensStore()

	const skeletonCount = 3
	const skeletons = Array.from({ length: skeletonCount }).map((_, index) => <TokenSkeleton key={index} />)

	if (!srcTokensLoading && srcTokens.length === 0) {
		return null
	}

	return (
		<div className={classNames['popular']}>
			<h4 className={classNames['popular-title']}>Popular Tokens</h4>
			{srcTokensLoading
				? skeletons
				: srcTokens.map(token => (
						<Token key={token.address} token={token} chain={srcChain!} showBalance={false} />
					))}
		</div>
	)
}
