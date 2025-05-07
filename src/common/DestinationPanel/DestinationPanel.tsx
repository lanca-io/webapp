import type { FC } from 'react'
import { useMemo } from 'react'
import { AmountInput } from '../AmountInput/AmountInput'
import { SkeletonLoader } from '../../components/layout/SkeletonLoader/SkeletonLoader'
import { BalanceInfo } from '../BalanceInfo/BalanceInfo'
import { useFormStore } from '../../store/form/useFormStore'
import { ETAInfo } from '../ETAInfo/ETAInfo'
import { GasInfo } from '../GasInfo/GasInfo'
import './DestinationPanel.pcss'

type DestinationPanelProps = {
	amount: string
	isLoading: boolean
}

export const DestinationPanel: FC<DestinationPanelProps> = ({ amount, isLoading }) => {
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

	return (
		<div className="destination_panel">
			{isLoading ? skeleton : amountInput}
			{balanceInfo}
			{gasInfo}
			{etaInfo}
		</div>
	)
}
