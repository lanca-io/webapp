import type { FC } from 'react'
import { PoolsActionStatus, PoolsStateActions } from '../../Reducer/types'
import { memo, useCallback } from 'react'
import { Button } from '@concero/ui-kit'
import { usePoolsActionContext } from '../../Reducer/Provider'
import './ProcessAction.pcss'

export const ProcessAction: FC = memo(() => {
	const { state, dispatch } = usePoolsActionContext()

	const currentStatus =
		state.queue !== PoolsActionStatus.IDLE ? state.queue : state.allowance

	const isFinalStage =
		state.allowance === PoolsActionStatus.FAILED ||
		state.allowance === PoolsActionStatus.REJECTED ||
		state.queue === PoolsActionStatus.FAILED ||
		state.queue === PoolsActionStatus.REJECTED ||
		state.queue === PoolsActionStatus.SUCCESS

	const handleReset = useCallback(() => {
		dispatch({ type: PoolsStateActions.RESET })
	}, [dispatch])

	if (!isFinalStage) {
		return null
	}

	if (
		currentStatus === PoolsActionStatus.FAILED ||
		currentStatus === PoolsActionStatus.REJECTED
	) {
		return (
			<div className="process_action">
				<Button
					variant="secondary_color"
					size="l"
					isFull
					onClick={handleReset}
					data-testid="try-again-button"
				>
					Try again
				</Button>
			</div>
		)
	}

	if (currentStatus === PoolsActionStatus.SUCCESS) {
		return (
			<div className="process_action">
				<Button
					variant="secondary_color"
					size="l"
					isFull
					onClick={handleReset}
					data-testid="swap-again-button"
				>
					Open Pool
				</Button>
			</div>
		)
	}

	return null
})
