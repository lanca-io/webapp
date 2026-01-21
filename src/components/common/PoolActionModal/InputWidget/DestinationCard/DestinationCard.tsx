import type { FC } from 'react'
import { useMemo } from 'react'
import { PoolsExecutionType } from '@/store/pools-execution/types'
import { AssetPanel, Direction } from '../AssetPanel/AssetPanel'
import { WidgetInput } from '@/components/common/WidgetInput/WidgetInput'
import { BalancePanel } from '../BalancePanel/BalancePanel'
import './DestinationCard.pcss'

type DestinationCardProps = {
	type: PoolsExecutionType
}

export const DestinationCard: FC<DestinationCardProps> = ({ type }) => {
	const panel = useMemo(
		() => <AssetPanel type={type} direction={Direction.To} />,
		[type],
	)

	const input = useMemo(
		() => <WidgetInput value="" placeholder="0" disabled />,
		[],
	)

	const balance = useMemo(
		() => <BalancePanel type={type} direction={Direction.To} />,
		[type],
	)

	return (
		<div className="pool_action_destination_card">
			{panel}
			{input}
			{balance}
		</div>
	)
}
