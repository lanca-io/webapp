import type { FC } from 'react'
import { useMemo } from 'react'
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
import { Spinner } from '@concero/ui-kit'
import './DestinationPanel.pcss'

type DestinationPanelProps = {
	amount: string
	isLoading: boolean
}

export const DestinationPanel: FC<DestinationPanelProps> = ({ amount, isLoading }) => {
	const { route, isLoading: routeLoading } = useRouteStore()
	const { destinationToken } = useFormStore()

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
	const etaInfo = useMemo(() => <ETAInfo />, [])
	const gasInfo = useMemo(() => <GasInfo />, [])
	const slippageInfo = useMemo(() => <SlippageInfo />, [])

	const reviewButton = useMemo(
		() => (
			<Button isFull variant="secondary" rightIcon={<TrailArrowRightIcon />}>
				Review
			</Button>
		),
		[],
	)

	return (
		<div className="destination_panel">
			<div className="destination_panel_input">
				{isLoading ? skeleton : amountInput}
				{balanceInfo}
			</div>
			{route && !routeLoading && (
				<div className="destination_panel_info">
					{slippageInfo}
					{gasInfo}
					{etaInfo}
					{reviewButton}
				</div>
			)}
			{routeLoading && (
				<div className="destination_panel_loader">
					<Spinner type="gray" />
				</div>
			)}
		</div>
	)
}
