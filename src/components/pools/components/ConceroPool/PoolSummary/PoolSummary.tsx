import classNames from './PoolSummary.module.pcss'
import { useGetFees } from '../../../hooks/useGetFees'
import { PoolLiquidityCard } from './PoolLiquidityCard/PoolLiquidityCard'
import { RewardsCard } from '../../PoolLanding/RewardsCard/RewardsCard'
import { APYCard } from './APYCard/APYCard'

export const PoolSummary = () => {
	const { fees, isLoading } = useGetFees()

	return (
		<div className={classNames.summaryContainer}>
			<h5 className={classNames.sectionTitle}>Pool summary</h5>
			<div className={classNames.summaryContent}>
				<div className="gap-lg">
					<PoolLiquidityCard />
					<RewardsCard
						fees={fees}
						isLoading={isLoading}
						size="small"
						title="Rewards Distributed"
						height={72}
						withFilter={false}
						showTooltip={false}
					/>
				</div>
				<APYCard fees={fees} isLoading={isLoading} />
			</div>
		</div>
	)
}
