import { type FC, useState } from 'react'
import type { PopularProps } from './types'
import { Token, TokenSkeleton } from '../Token/Token'
import { useTokensStore } from '../../../../../store/tokens/useTokensStore'
import classNames from './Popular.module.pcss'
import { useFormStore } from '../../../../../store/form/useFormStore'
import { View } from '../../View/View'

export const Popular: FC<PopularProps> = ({ direction }) => {
	const {
		srcTokens,
		srcTokensLoading,
		dstTokens,
		dstTokensLoading,
		allTokens,
		allTokensLoading,
		srcOffset,
		dstOffset,
		allOffset,
		setSrcOffset,
		setDstOffset,
		setAllOffset,
	} = useTokensStore()
	const { srcChain, dstChain } = useFormStore()
	const [visibleCount, setVisibleCount] = useState<number>(15)
	const increment = 15

	const tokens = direction === 'from' ? (srcChain ? srcTokens : allTokens) : dstChain ? dstTokens : allTokens
	const loading =
		direction === 'from'
			? srcChain
				? srcTokensLoading
				: allTokensLoading
			: dstChain
				? dstTokensLoading
				: allTokensLoading

	const handleExpand = () => {
		setVisibleCount(prevCount => prevCount + increment)
		if (direction === 'from') {
			if (srcChain) {
				setSrcOffset(srcOffset + increment)
			} else {
				setAllOffset(allOffset + increment)
			}
		} else {
			if (dstChain) {
				setDstOffset(dstOffset + increment)
			} else {
				setAllOffset(allOffset + increment)
			}
		}
	}

	const handleShowLess = () => {
		setVisibleCount(increment)
	}

	const skeletonCount = 15
	const skeletons = Array.from({ length: skeletonCount }).map((_, index) => <TokenSkeleton key={index} />)

	if (!loading && tokens.length === 0) {
		return null
	}

	return (
		<div className={classNames['popular']}>
			<h4 className={classNames['popular-title']}>Popular Tokens</h4>
			{tokens.slice(0, visibleCount).map((token, index) => (
				<Token key={`${token.address}-${index}`} token={token} showBalance={false} />
			))}
			{loading && skeletons}
			<View isExpanded={tokens.length > 8453} handleExpand={handleExpand} handleShowLess={handleShowLess} />
		</div>
	)
}
