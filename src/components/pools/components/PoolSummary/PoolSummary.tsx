import classNames from './PoolSummary.module.pcss'
import { useGetFees } from '../../hooks/useGetFees'
import { PoolLiquidityCard } from './PoolLiquidityCard/PoolLiquidityCard'

export const PoolSummary = () => {
	const { fees, isLoading } = useGetFees()

	return (
		<div className={classNames.summaryContainer}>
			<h5>Pool summary</h5>
			<div className={classNames.summaryContent}>
				<div className="gap-lg">
					<PoolLiquidityCard />
				</div>
			</div>
		</div>
	)
}
