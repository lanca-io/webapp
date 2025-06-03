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
import { useSubvariantStore } from '../../../../../store/subvariant/useSubvariantStore'
import { format } from '../../../../../utils/new/format'
import { truncateAddress } from '../../../../../utils/new/truncate'
import { SplitSubvariantType } from '../../../../../store/subvariant/types'
import { Address } from 'viem'
import './Success.pcss'

export const Success: FC = memo((): JSX.Element => {
	const { executionTime } = useTxExecutionStore()
	const { state } = useSubvariantStore()
	const { toToken, toChain, fromAmount, toAddress, addressInput } = useFormStore()
	const { isLoading } = useLoadTxExecutionTime()
	const { route } = useRouteStore()

	const formattedAmount = useMemo(() => {
		if (!fromAmount || fromAmount === '0') return '0'
		return formatTokenAmount(route?.to.amount, toToken?.decimals || 0)
	}, [fromAmount, route?.to.amount, toToken?.decimals])

	const hasDestination = state === SplitSubvariantType.SEND && Boolean(toAddress && addressInput)

	const imageSrc = '/Swap/Success.webp'
	const altText = 'Success Process'
	const headingText = hasDestination ? 'You sent' : 'You received'

	return (
		<>
			<div className="success">
				<img src={imageSrc} alt={altText} className="success_image" data-testid="success-image" />
			</div>
			<div className="success_info">
				<div className="success_info_heading">
					<span className="success_info_text">{headingText}</span>
				</div>
				<div className="success_info_stats">
					<div className="success_info_details">
						<div className="success_info_token">
							<Badge logoURL={toToken?.logoURI} size="m" />
							<p className="success_info_name">{toToken?.symbol}</p>
						</div>
						<p className="success_info_pointer">on</p>
						<div className="success_info_chain">
							<Badge logoURL={toChain?.logoURI || ''} size="m" />
							<p className="success_info_name">{toChain?.name}</p>
						</div>
					</div>
					{!hasDestination && <p className="success_info_number">{format(Number(formattedAmount), 3)}</p>}
					{hasDestination && (
						<div className="success_info_destination">
							<p className="success_info_number_destination">{format(Number(formattedAmount), 3)}</p>
							<p className="success_info_destination_pointer">To</p>
							<div className="success_info_destination_data">
								<p className="success_info_resolved">{truncateAddress(toAddress as Address)}</p>
								<p className="success_info_unresolved">
									{addressInput && addressInput.includes('.') ? addressInput : '-'}
								</p>
							</div>
						</div>
					)}
					<div className="success_info_timer">
						<ClockIcon color="var(--color-primary-500)" />
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
