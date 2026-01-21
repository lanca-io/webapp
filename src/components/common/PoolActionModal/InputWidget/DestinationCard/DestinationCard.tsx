import type { FC } from 'react'
import { useMemo } from 'react'
import { PoolActionType } from '@/store/pool-action-execution/types'
import { AssetPanel, Direction } from '../AssetPanel/AssetPanel'
import './DestinationCard.pcss'

type DestinationCardProps = {
	type: PoolActionType
}

export const DestinationCard: FC<DestinationCardProps> = ({ type }) => {
	const panel = useMemo(
		() => <AssetPanel type={type} direction={Direction.TO} />,
		[type],
	)

	return <div className="pool_action_destination_card">{panel}</div>
}
