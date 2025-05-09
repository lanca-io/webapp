import type { FC } from 'react'
import { useMemo, useState } from 'react'
import { AmountInput } from '../AmountInput/AmountInput'
import { SkeletonLoader } from '../../components/layout/SkeletonLoader/SkeletonLoader'
import { BalanceInfo } from '../BalanceInfo/BalanceInfo'
import { useFormStore } from '../../store/form/useFormStore'
import { ETAInfo } from '../ETAInfo/ETAInfo'
import { GasInfo } from '../GasInfo/GasInfo'
import { SlippageInfo } from '../SlippageInfo/SlippageInfo'
import { Button } from '@concero/ui-kit'
import { TrailArrowRightIcon } from '../../assets/icons/TrailArrowRightIcon'
import { useRouteStore } from '../../store/route/useRouteStore'
import { ReviewModal } from '../ReviewModal/ReviewModal'
import { Spinner } from '@concero/ui-kit'
import { DestinationValue } from '../DestinationValue/DestinationValue'
import './DestinationPanel.pcss'

type DestinationPanelProps = {
	amount: string
	isLoading: boolean
}

export const DestinationPanel: FC<DestinationPanelProps> = ({ amount, isLoading }) => {
	const { route, isLoading: routeLoading } = useRouteStore()
	const { destinationToken } = useFormStore()
	const [isReviewModalOpen, setIsReviewModalOpen] = useState<boolean>(false)

	const handleOpenReviewModal = () => {
		setIsReviewModalOpen(true)
	}

	const handleCloseReviewModal = () => {
		setIsReviewModalOpen(false)
	}

	const skeleton = useMemo(() => <SkeletonLoader height={60} width={160} />, [])
	const hasBalance = useMemo(
		() => destinationToken && destinationToken.balance !== undefined && destinationToken.balance !== null,
		[destinationToken],
	)
	const amountInput = useMemo(() => <AmountInput value={amount || '0'} disabled={true} />, [amount])

	const balanceInfo = useMemo(
		() => (hasBalance ? <BalanceInfo token={destinationToken} showMax={false} /> : null),
		[destinationToken, hasBalance],
	)

	const valueInfo = useMemo(() => <DestinationValue />, [route, destinationToken])
	const etaInfo = useMemo(() => <ETAInfo />, [])
	const gasInfo = useMemo(() => <GasInfo />, [])
	const slippageInfo = useMemo(() => <SlippageInfo />, [])

	const reviewButton = useMemo(
		() => (
			<Button isFull variant="secondary" rightIcon={<TrailArrowRightIcon />} onClick={handleOpenReviewModal}>
				Review
			</Button>
		),
		[handleOpenReviewModal],
	)

	return (
		<div className="destination_panel">
			<div className="destination_panel_input">
				{isLoading ? skeleton : amountInput}
				{valueInfo}
				{balanceInfo}
			</div>

			<div className="destination_panel_info">
				{slippageInfo}
				{route && !routeLoading && (
					<>
						{gasInfo}
						{etaInfo}
						{reviewButton}
					</>
				)}
			</div>

			{routeLoading && (
				<div className="destination_panel_loader">
					<Spinner type="gray" />
				</div>
			)}
			<ReviewModal isOpen={isReviewModalOpen} onClose={handleCloseReviewModal} />
		</div>
	)
}
