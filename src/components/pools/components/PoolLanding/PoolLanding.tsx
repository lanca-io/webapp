import classNames from './PoolLanding.module.pcss'
import { useGetFees } from '../../hooks/useGetFees'
import { useGetLPProvidersCount } from '../../hooks/useGetLPProviders'
import { useGetTransactionsCount } from '../../hooks/useGetTxCount'
import { VolumeCard } from './VolumeCard/VolumeCard'
import { RewardsCard } from './RewardsCard/RewardsCard'
import { StatCard } from './StatCard/StatCard'
import { PoolCard } from './PoolCard/PoolCard'
import { PoolUSDC } from '../../../../assets/icons/PoolUSDC'
import { PoolETH } from '../../../../assets/icons/PoolETH'
import { RefreshIcon } from '../../../../assets/icons/RefreshIcon'
import { LPIcon } from '../../../../assets/icons/LPIcon'

export const PoolLanding = (): JSX.Element => {
	const { fees, isLoading: feesLoading } = useGetFees()
	const { lpProviders, isLoading: providersLoading } = useGetLPProvidersCount()
	const { transactionsCount, isLoading: txCountLoading } = useGetTransactionsCount()

	return (
		<div className={classNames.container}>
			<div className="gap-xxl">
				<div className="gap-lg">
					<div className={classNames.section}>
						<VolumeCard fees={fees} isLoading={feesLoading} />
						<RewardsCard fees={fees} isLoading={feesLoading} />
					</div>
					<div className={`gap-lg row ${classNames.statSection}`}>
						<StatCard
							title="Transactions"
							value={transactionsCount}
							isLoading={txCountLoading}
							icon={<RefreshIcon />}
						/>
						<StatCard
							title="Liquidity Providers"
							value={lpProviders}
							isLoading={providersLoading}
							icon={<LPIcon />}
						/>
					</div>
				</div>
				<div className="gap-xxl">
					<div className="gap-sm">
						<h6 className={classNames.sectionHeading}>Pools</h6>
						<div className={classNames.section}>
							<PoolCard title="USDC" fees={fees} isDisabled={false} icon={<PoolUSDC />} />
							<PoolCard title="ETH" fees={fees} isDisabled={true} icon={<PoolETH />} />
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
