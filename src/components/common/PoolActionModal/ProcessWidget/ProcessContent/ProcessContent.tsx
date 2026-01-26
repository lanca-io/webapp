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
		if (queue !== PoolsActionStatus.IDLE) {
			switch (queue) {
				case PoolsActionStatus.FAILED:
					return <Failure />
				case PoolsActionStatus.REJECTED:
					return <Rejected />
				case PoolsActionStatus.SUCCESS:
					return <Success />
				case PoolsActionStatus.PENDING:
					return <Transaction />
			}
		}

		switch (allowance) {
			case PoolsActionStatus.REJECTED:
				return <Rejected />
			case PoolsActionStatus.FAILED:
				return <Failure />
			case PoolsActionStatus.PENDING:
				return <Approval />
			default:
				return null
		}
	})()

	return currentContent ? (
		<div className="pool_action_process_content">{currentContent}</div>
	) : null
})
