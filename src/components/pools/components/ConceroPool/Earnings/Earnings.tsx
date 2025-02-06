import { useAccount } from 'wagmi'
import { Card } from '../../../../cards/Card/Card'
import { useGetUserLPBalance } from '../../../hooks/useGetUserLPBalance'
import { useGetUserEarnings } from '../../../hooks/useGetUserEarnings'
import { EarningsFooter } from './EarningsFooter/EarningsFooter'
import { SkeletonLoader } from '../../../../layout/SkeletonLoader/SkeletonLoader'
import { Tag } from '../../../../layout/Tag/Tag'
import { toLocaleNumber } from '../../../../../utils/formatting'
import { ArrowUpIcon } from '../../../../../assets/icons/ArrowUpIcon'

import classNames from './Earnings.module.pcss'

interface EarningsProps {
	poolIsFilled: boolean
	poolDataIsLoading: boolean
}

export const Earnings = ({ poolIsFilled, poolDataIsLoading }: EarningsProps): JSX.Element => {
	const { address, isConnected } = useAccount()
	const { loading: lpBalanceLoading, userHasDeposited } = useGetUserLPBalance(address)
	const { userEarnings, loading: earningsLoading } = useGetUserEarnings(address)

	const isLoading = lpBalanceLoading || earningsLoading || poolDataIsLoading

	if (!isConnected || !userHasDeposited) {
		return (
			<Card className={classNames.earnings}>
				<h4>Your Earnings</h4>
				<div className={classNames.placeholder}>
					<div className={classNames.placeholderText}>
						{!isConnected ? (
							<h2>
								Connect wallet <br /> to manage your earnings
							</h2>
						) : (
							<>
								<h2>You haven't deposited yet</h2>
								<p>Make your first deposit to start earn in this pool.</p>
							</>
						)}
					</div>
				</div>
				<EarningsFooter
					userHasDeposited={userHasDeposited}
					poolDataIsLoading={poolDataIsLoading}
					poolIsFilled={poolIsFilled}
				/>
			</Card>
		)
	}

	return (
		<Card className={classNames.earnings}>
			<div className={classNames.header}>
				<div className="row gap-sm ac">
					<h4 className={classNames.title}>Your Earnings</h4>
				</div>
			</div>
			<div className="row afe gap-sm">
				<div className={classNames.price}>
					{isLoading || !userEarnings ? (
						<SkeletonLoader className={classNames.value} width={244} height={68} />
					) : (
						<h1>${toLocaleNumber(userEarnings.earnings + userEarnings.deposit, 2)}</h1>
					)}

					{isLoading || !userEarnings ? (
						<SkeletonLoader className={classNames.value} width={149} height={32} />
					) : (
						<Tag variant="positive" size="md">
							<ArrowUpIcon />
							&nbsp; ${toLocaleNumber(userEarnings.earnings, 2)}
							&nbsp; ({toLocaleNumber(userEarnings.percents, 2)}%)
						</Tag>
					)}
				</div>
			</div>

			<EarningsFooter
				userHasDeposited={userHasDeposited}
				poolDataIsLoading={poolDataIsLoading}
				poolIsFilled={poolIsFilled}
			/>
		</Card>
	)
}
