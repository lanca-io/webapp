import { memo, useMemo } from 'react'
import { SkeletonLoader } from '../../components/layout/SkeletonLoader/SkeletonLoader'
import './Token.pcss'

type SkeletonProps = {
	showBalance?: boolean
}

export const TokenSkeleton = memo(({ showBalance = true }: SkeletonProps): JSX.Element => {
	const tokenBadgeSkeleton = useMemo(() => <SkeletonLoader width={32} height={32} />, [])
	const symbolSkeleton = useMemo(() => <SkeletonLoader width={29} height={17} />, [])
	const nameSkeleton = useMemo(() => <SkeletonLoader width={25} height={17} />, [])
	const balanceSkeleton = useMemo(
		() =>
			showBalance ? (
				<div className="token_price_container">
					<SkeletonLoader width={30} height={16} />
				</div>
			) : null,
		[showBalance],
	)

	return (
		<div className="token">
			<div className="token_content">
				{tokenBadgeSkeleton}
				<div className="token_description">
					{symbolSkeleton}
					<div className="token_information">{nameSkeleton}</div>
				</div>
			</div>
			{balanceSkeleton}
		</div>
	)
})
