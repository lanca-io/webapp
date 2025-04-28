import type { FC } from 'react'
import { memo } from 'react'
import { SkeletonLoader } from '../../components/layout/SkeletonLoader/SkeletonLoader'
import './Token.pcss'

type SkeletonProps = {
	showBalance?: boolean
}

export const TokenSkeleton: FC<SkeletonProps> = memo(({ showBalance = true }) => (
	<div className="token">
		<div className="token_content">
			<SkeletonLoader width={32} height={32} />
			<div className="token_description">
				<SkeletonLoader width={29} height={17} />
				<div className="token_information">
					<SkeletonLoader width={25} height={17} />
				</div>
			</div>
		</div>
		{showBalance && (
			<div className="token_price_container">
				<SkeletonLoader width={30} height={16} />
			</div>
		)}
	</div>
))
