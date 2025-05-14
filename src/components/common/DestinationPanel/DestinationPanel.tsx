import { memo, useCallback, useState } from 'react'
import { AmountInput } from '../AmountInput/AmountInput'
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
import './DestinationPanel.pcss'

type DestinationPanelProps = {
	amount: string
	isLoading: boolean
}

export const DestinationPanel = memo(({ amount, isLoading }: DestinationPanelProps): JSX.Element => {
	const { route, isLoading: routeLoading } = useRouteStore()
	const { destinationToken } = useFormStore()
	const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false)

	const handleOpenReviewModal = useCallback(() => {
		setIsReviewModalOpen(true)
	}, [])

	const handleCloseReviewModal = useCallback(() => {
		setIsReviewModalOpen(false)
	}, [])

	const hasBalance = Boolean(destinationToken?.balance !== undefined && destinationToken?.balance !== null)

	return (
		<div className="destination_panel" role="region" aria-label="Destination details">
			<div className="destination_panel_input">
				{isLoading ? (
					<SkeletonLoader height={60} width={160} />
				) : (
					<AmountInput value={amount || '0'} disabled />
				)}
				<DestinationValue />
				{hasBalance && <BalanceInfo token={destinationToken} showMax={false} />}
			</div>

			<div className="destination_panel_info">
				{route && !routeLoading && (
					<>
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
					</>
				)}
			</div>

			{routeLoading && (
				<div className="destination_panel_loader" aria-live="polite">
					<Spinner type="gray" aria-label="Loading route details" />
				</div>
			)}

			<ReviewModal isOpen={isReviewModalOpen} onClose={handleCloseReviewModal} />
		</div>
	)
})
