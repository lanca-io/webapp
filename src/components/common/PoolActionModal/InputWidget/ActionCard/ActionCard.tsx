import type { FC } from 'react'
import { Button } from '@concero/ui-kit'
import { PoolActionType } from '@/store/pools-execution/types'
import './ActionCard.pcss'

type ActionCardProps = {
	type: PoolActionType
}

export const ActionCard: FC<ActionCardProps> = ({ type }) => {
	return (
		<div className="pool_action_action_card">
			<Button variant="primary" size="l" isFull>
				{type === PoolActionType.DEPOSIT ? 'Deposit' : 'Withdraw'}
			</Button>
		</div>
	)
}
