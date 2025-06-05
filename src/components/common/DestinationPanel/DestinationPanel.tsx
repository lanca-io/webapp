import { memo, useCallback, useState } from 'react'
import { WidgetInput } from '../WidgetInput/WidgetInput'
import { SkeletonLoader } from '../../layout/SkeletonLoader/SkeletonLoader'
import { BalanceInfo } from '../BalanceInfo/BalanceInfo'
import { useFormStore } from '../../../store/form/useFormStore'
import { ETAInfo } from '../ETAInfo/ETAInfo'
import { GasInfo } from '../GasInfo/GasInfo'
import { SlippageInfo } from '../SlippageInfo/SlippageInfo'
import { Button } from '@concero/ui-kit'
import { TrailArrowRightIcon } from '../../../assets/icons/TrailArrowRightIcon'
import { useRouteStore } from '../../../store/route/useRouteStore'
import { ReviewModal } from '../ReviewModal/ReviewModal'
import { Spinner } from '@concero/ui-kit'
import { DestinationValue } from '../DestinationValue/DestinationValue'
import { Alert } from '../Alert/Alert'
import { useAccount } from 'wagmi'
import { InfoIcon } from '../../../assets/icons/InfoIcon'
import './DestinationPanel.pcss'

type DestinationPanelProps = {
	amount: string
	isLoading: boolean
}

export const DestinationPanel = memo(({ amount, isLoading }: DestinationPanelProps): JSX.Element => {
	const { address } = useAccount()
	const { route, isLoading: routeLoading, error } = useRouteStore()
	const { toToken } = useFormStore()
	const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false)
	const hasValidInputs = Boolean(amount && amount !== '0' && amount !== '')
	const isIdle = !routeLoading && !route && !error && !hasValidInputs

	const handleOpenReviewModal = useCallback(() => {
		setIsReviewModalOpen(true)
	}, [])

	const handleCloseReviewModal = useCallback(() => {
		setIsReviewModalOpen(false)
	}, [])

	const hasBalance = Boolean(toToken?.balance !== undefined && toToken?.balance !== null)

	return (
		<div className="destination_panel">
			<div className="destination_panel_input">
				{isLoading ? (
					<SkeletonLoader height={60} width={160} />
				) : (
					<WidgetInput type="text" value={amount || '0'} disabled />
				)}
				<DestinationValue />
				{address && hasBalance && <BalanceInfo token={toToken} showMax={false} />}
			</div>

			{routeLoading ? (
				<div className="destination_panel_loader">
					<Spinner type="gray" />
				</div>
			) : error ? (
				<Alert title={error} variant="error" icon={<InfoIcon color="var(--color-danger-600)" />} />
			) : route ? (
				<div className="destination_panel_info">
					<SlippageInfo />
					<GasInfo />
					<ETAInfo />
					<Button
						isFull
						variant="secondary"
						rightIcon={<TrailArrowRightIcon aria-hidden="true" />}
						onClick={handleOpenReviewModal}
						aria-label="Review transaction details"
					>
						Review
					</Button>
				</div>
			) : isIdle ? null : (
				<Alert title="No route found" variant="error" icon={<InfoIcon color="var(--color-danger-600)" />} />
			)}

			<ReviewModal isOpen={isReviewModalOpen} onClose={handleCloseReviewModal} />
		</div>
	)
})
