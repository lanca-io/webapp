import type { FC } from 'react'
import { Button } from '@concero/ui-kit'
import { PoolsActionType } from '../../Reducer/types'
import './ActionCard.pcss'

type ActionCardProps = {
	type: PoolsActionType
}

export const ActionCard: FC<ActionCardProps> = ({ type }) => {
	return (
		<div className="pool_action_action_card">
			<Button variant="primary" size="l" isFull>
				{type === PoolsActionType.DEPOSIT ? 'Deposit' : 'Withdraw'}
			</Button>
		</div>
	)
}
