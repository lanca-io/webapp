import type { FC } from 'react'
import { useMemo, memo } from 'react'
import { Badge } from '../../../Badge/Badge'
import { useFormStore } from '../../../../../store/form/useFormStore'
import { formatTokenAmount } from '../../../../../utils/new/tokens'
import { useTxExecutionStore } from '../../../../../store/tx-execution/useTxExecutionStore'
import { ClockIcon } from '../../../../../assets/icons/ClockIcon'
import { useLoadTxExecutionTime } from '../../../../../hooks/Loadables/useLoadTxExecutionTime'
import { SkeletonLoader } from '../../../../layout/SkeletonLoader/SkeletonLoader'
import { useRouteStore } from '../../../../../store/route/useRouteStore'
import { format } from '../../../../../utils/new/format'
import './Success.pcss'

export const Success: FC = memo((): JSX.Element => {
	const { executionTime } = useTxExecutionStore()
	const { destinationToken, destinationChain, amount } = useFormStore()
	const { isLoading } = useLoadTxExecutionTime()
	const { route } = useRouteStore()

	const formattedAmount = useMemo(() => {
		if (!amount || amount === '0') return '0'
		return formatTokenAmount(route?.to.amount, destinationToken?.decimals || 0)
	}, [amount])

	const imageSrc = '/Swap/Success.webp'
	const altText = 'Success Process'
	const headingText = 'You received'

	return (
		<>
			<div className="success">
				<img src={imageSrc} alt={altText} className="success_image" data-testid="success-image" />
			</div>
			<div className="success_info">
				<div className="success_info_heading">
					<h5 className="success_info_text">{headingText}</h5>
				</div>
				<div className="success_info_stats">
					<div className="success_info_details">
						<div className="success_info_token">
							<Badge logoURL={destinationToken?.logoURI} size="m" />
							<p className="success_info_name">{destinationToken?.symbol}</p>
						</div>
						<p className="success_info_pointer">on</p>
						<div className="success_info_chain">
							<Badge logoURL={destinationChain?.logoURL || ''} size="m" />
							<p className="success_info_name">{destinationChain?.name}</p>
						</div>
					</div>
					<p className="success_info_number" data-testid="success-amount">
						{format(Number(formattedAmount), 3)}
					</p>
					<div className="success_info_timer">
						<ClockIcon color="#097BB3" />
						{isLoading ? (
							<SkeletonLoader width={87} height={18} className="success_info_timer_skeleton" />
						) : (
							<p className="success_info_timer_text">{`In ${executionTime} seconds`}</p>
						)}
					</div>
				</div>
			</div>
		</>
	)
})
