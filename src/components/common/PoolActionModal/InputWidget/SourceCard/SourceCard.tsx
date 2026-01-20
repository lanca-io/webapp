import type { FC } from 'react'
import { useMemo } from 'react'
import { Header } from './Header/Header'
import { PoolActionType } from '@/store/pool-action-execution/types'
import { AssetPanel, Direction } from '../AssetPanel/AssetPanel'
import './SourceCard.pcss'

type SourceCardProps = {
	type: PoolActionType
}

export const SourceCard: FC<SourceCardProps> = ({ type }) => {
	const header = useMemo(
		() => (
			<Header
				title={type === PoolActionType.DEPOSIT ? 'Deposit' : 'Withdrawal'}
				onClose={() => {}}
			/>
		),
		[type],
	)

	const panel = useMemo(
		() => <AssetPanel type={type} direction={Direction.From} />,
		[type],
	)

	return (
		<div className="pool_action_source_card">
			{header}
			{panel}
		</div>
	)
}
