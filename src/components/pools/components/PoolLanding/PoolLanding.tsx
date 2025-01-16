import classNames from './PoolLanding.module.pcss'
import { useGetFees } from '../../hooks/useGetFees'
// import { useGetLPProvidersCount } from "../../hooks/useGetLPProviders"
// import { useGetTransactionsCount } from "../../hooks/useGetTxCount"
import { VolumeCard } from './VolumeCard/VolumeCard'
import { RewardsCard } from './RewardsCard/RewardsCard'

export const PoolLanding = (): JSX.Element => {
	const { fees, isLoading: feesLoading } = useGetFees()
	// const { lpProviders, isLoading: providersLoading } = useGetLPProvidersCount()
	// const { transactionsCount, isLoading: txCountLoading } = useGetTransactionsCount()

	return (
		<div className={classNames.container}>
			<div className="gap-lg">
				<div className={classNames.section}>
					<VolumeCard fees={fees} isLoading={feesLoading} />
					<RewardsCard fees={fees} isLoading={false} />
				</div>
			</div>
		</div>
	)
}
