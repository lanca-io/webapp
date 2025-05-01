import type { FC } from 'react'
import { useMemo } from 'react'
import { AmountInput } from '../AmountInput/AmountInput'
import { SkeletonLoader } from '../../components/layout/SkeletonLoader/SkeletonLoader'
import './DestinationPanel.pcss'

type DestinationPanelProps = {
	amount: string
	isLoading: boolean
}

export const DestinationPanel: FC<DestinationPanelProps> = ({ amount, isLoading }) => {
	const skeleton = useMemo(() => <SkeletonLoader height={56} width={160} />, [])

	const amountInput = useMemo(
		() => <AmountInput value={amount || '0'} onChange={() => {}} disabled={true} />,
		[amount],
	)

	return <div className="destination_panel">{isLoading ? skeleton : amountInput}</div>
}
