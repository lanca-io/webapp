import type { FC } from 'react'
import { Button } from '@concero/ui-kit'
import { PoolsActionType } from '../../Reducer/types'
import { useInputWidgetContext } from '../Reducer/Provider'
import { usePoolsActionContext } from '../../Reducer/Provider'
import { useActionExecution } from '../useActionExecution'
import './ActionCard.pcss'

type ActionCardProps = {
	type: PoolsActionType
}

export const ActionCard: FC<ActionCardProps> = ({ type }) => {
	const { state: inputState } = useInputWidgetContext()
	const { dispatch: poolsDispatch } = usePoolsActionContext()
	const { execute } = useActionExecution(
		inputState.rawInput,
		poolsDispatch,
		type,
	)

	const isWarning = !!inputState.warning
	const isError = !!inputState.error
	const isDisabled =
		isWarning || isError || !inputState.input || inputState.rawInput === 0n

	const onAction = async () => {
		try {
			await execute()
		} catch (error) {
			console.error('Action failed:', error)
		}
	}

	return (
		<div className="pool_action_action_card">
			<Button
				variant="primary"
				size="l"
				isFull
				isDisabled={isDisabled}
				onClick={onAction}
			>
				{type === PoolsActionType.Deposit ? 'Deposit' : 'Withdraw'}
			</Button>
		</div>
	)
}
