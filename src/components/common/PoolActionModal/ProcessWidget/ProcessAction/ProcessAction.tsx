import type { FC } from 'react'
import { memo, useCallback } from 'react'
import { Button } from '@concero/ui-kit'
import { usePoolsActionContext } from '../../Reducer/Provider'
import { PoolsActionStatus, PoolsStateActions } from '../../Reducer/types'
import { useInputWidgetContext } from '../../InputWidget/Reducer/Provider'
import { useActionExecution } from '../../InputWidget/useActionExecution'
import { useLocation, useNavigate } from 'react-router-dom'
import { routes } from '@/constants'
import './ProcessAction.pcss'

type ProcessActionProps = {
	onClose: () => void
}

export const ProcessAction: FC<ProcessActionProps> = memo(({ onClose }) => {
	const navigate = useNavigate()
	const location = useLocation()
	const pathname = location.pathname

	const { state: actionState, dispatch } = usePoolsActionContext()
	const { state: inputState } = useInputWidgetContext()
	const { execute } = useActionExecution(
		inputState.rawInput,
		dispatch,
		actionState.type,
	)

	const currentStatus =
		actionState.queue !== PoolsActionStatus.IDLE
			? actionState.queue
			: actionState.allowance

	const isFinalStage =
		actionState.allowance === PoolsActionStatus.FAILED ||
		actionState.allowance === PoolsActionStatus.REJECTED ||
		actionState.queue === PoolsActionStatus.FAILED ||
		actionState.queue === PoolsActionStatus.REJECTED ||
		actionState.queue === PoolsActionStatus.SUCCESS

	const handleReset = useCallback(() => {
		dispatch({ type: PoolsStateActions.RESET })
	}, [dispatch])

	const isPoolPage = pathname === routes.usdcPools

	if (!isFinalStage) return null

	if (
		currentStatus === PoolsActionStatus.FAILED ||
		currentStatus === PoolsActionStatus.REJECTED
	) {
		return (
			<div className="pool_action_process_action">
				<Button
					variant="secondary_color"
					size="l"
					isFull
					onClick={async () => {
						handleReset()
						await execute()
					}}
					data-testid="try-again-button"
				>
					Try again
				</Button>
			</div>
		)
	}

	if (currentStatus === PoolsActionStatus.SUCCESS) {
		return (
			<div className="pool_action_process_action">
				<Button
					variant="secondary_color"
					size="l"
					isFull
					onClick={() => {
						handleReset()
						if (isPoolPage) {
							onClose()
						} else {
							navigate(routes.pools)
						}
					}}
					data-testid="open-pool-button"
				>
					Open Pool
				</Button>
			</div>
		)
	}

	return null
})
