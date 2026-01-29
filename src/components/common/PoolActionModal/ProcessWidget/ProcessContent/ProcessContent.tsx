import type { FC } from 'react'
import { memo } from 'react'
import { PoolsActionStatus } from '../../Reducer/types'
import { usePoolsActionContext } from '../../Reducer/Provider'
import { Approval } from './Approval/Approval'
import { Transaction } from './Transaction/Transaction'
import { Failure } from './Failure/Failure'
import { Success } from './Success/Success'
import { Rejected } from './Rejected/Rejected'
import './ProcessContent.pcss'

export const ProcessContent: FC = memo(() => {
	const { state } = usePoolsActionContext()
	const { allowance, queue } = state

	const currentContent = (() => {
		if (queue !== PoolsActionStatus.Idle) {
			switch (queue) {
				case PoolsActionStatus.Failed:
					return <Failure />
				case PoolsActionStatus.Rejected:
					return <Rejected />
				case PoolsActionStatus.Success:
					return <Success />
				case PoolsActionStatus.Pending:
					return <Transaction />
			}
		}

		switch (allowance) {
			case PoolsActionStatus.Rejected:
				return <Rejected />
			case PoolsActionStatus.Failed:
				return <Failure />
			case PoolsActionStatus.Pending:
				return <Approval />
			case PoolsActionStatus.Success:
				return <Transaction />
			default:
				return null
		}
	})()

	return currentContent ? (
		<div className="pool_action_process_content">{currentContent}</div>
	) : null
})
