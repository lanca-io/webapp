import type { FC } from 'react'
import { Button } from '@concero/ui-kit'
import { PoolsActionType } from '../../Reducer/types'
import { useInputWidgetContext } from '../Reducer/Provider'
import './ActionCard.pcss'

type ActionCardProps = {
	type: PoolsActionType
}

export const ActionCard: FC<ActionCardProps> = ({ type }) => {
	const { state } = useInputWidgetContext()

	const isWarning: boolean = !!state.warning
	const isError: boolean = !!state.error

	return (
		<div className="pool_action_action_card">
			<Button
				variant="primary"
				size="l"
				isFull
				isDisabled={isWarning || isError || !state.input}
			>
				{type === PoolsActionType.DEPOSIT ? 'Deposit' : 'Withdraw'}
			</Button>
		</div>
	)
}
