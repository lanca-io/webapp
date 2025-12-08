import { memo } from 'react'
import { SkeletonLoader } from '../../../../../layout/SkeletonLoader/SkeletonLoader'
import { PoolCard } from '../../../Pool/Pool'

import classNames from './EarningsFooter.module.pcss'
import { UserActions } from '../../UserActions/UserActions'

interface EarningsFooterProps {
	poolDataIsLoading: boolean
	poolIsFilled: boolean
	userHasDeposited: boolean
}

const EarningsFooterComponent = ({
	poolDataIsLoading,
	poolIsFilled,
	userHasDeposited,
}: EarningsFooterProps): JSX.Element => {
	return (
		<div className={classNames.footer}>
			{poolDataIsLoading ? (
				<>
					<div className="gap-sm row">
						<SkeletonLoader height={48} width={177} />
						<SkeletonLoader height={48} width={177} />
					</div>
					<SkeletonLoader height={48} width={190} />
				</>
			) : (
				<>
					<div className={classNames.poolButtons}>
						<PoolCard
							poolIsFilled={poolIsFilled}
							userHasDeposited={userHasDeposited}
							depositButtonClasses={classNames.button}
							withdrawalButtonClasses={classNames.button}
						/>
					</div>
					<UserActions />
				</>
			)}
		</div>
	)
}

export const EarningsFooter = memo(EarningsFooterComponent)
