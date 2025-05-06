import type { FC } from 'react'
import { useMemo } from 'react'
import { AmountInput } from '../AmountInput/AmountInput'
import { SkeletonLoader } from '../../components/layout/SkeletonLoader/SkeletonLoader'
import { BalanceInfo } from '../BalanceInfo/BalanceInfo'
import { useFormStore } from '../../store/form/useFormStore'
import './DestinationPanel.pcss'

type DestinationPanelProps = {
	amount: string
	isLoading: boolean
}

export const DestinationPanel: FC<DestinationPanelProps> = ({ amount, isLoading }) => {
	const { destinationToken } = useFormStore()
	const skeleton = useMemo(() => <SkeletonLoader height={60} width={160} />, [])

	const amountInput = useMemo(
		() => <AmountInput value={amount || '0'} onChange={() => {}} disabled={true} />,
		[amount],
	)
	const balanceInfo = useMemo(() => <BalanceInfo token={destinationToken} showMax={false} />, [])

	return (
		<div className="destination_panel">
			{isLoading ? skeleton : amountInput}
			{balanceInfo}
		</div>
	)
}
