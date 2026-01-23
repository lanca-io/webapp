import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { Approval } from './Approval/Approval'
import { Transaction } from './Transaction/Transaction'
import { Failure } from './Failure/Failure'
import { Success } from './Success/Success'
import { PoolsActionStatus } from '../../Reducer/types'
import { usePoolsActionContext } from '../../Reducer/Provider'
import './ProcessContent.pcss'

export const ProcessContent: FC = memo(() => {
	const { state } = usePoolsActionContext()
	const { allowance, queue } = state

	const txStatus = useMemo((): PoolsActionStatus => {
		if (
			queue === PoolsActionStatus.FAILED ||
			allowance === PoolsActionStatus.FAILED
		)
			return PoolsActionStatus.FAILED
		if (
			queue === PoolsActionStatus.REJECTED ||
			allowance === PoolsActionStatus.REJECTED
		)
			return PoolsActionStatus.REJECTED
		if (queue === PoolsActionStatus.SUCCESS) return PoolsActionStatus.SUCCESS
		if (
			queue === PoolsActionStatus.PENDING ||
			allowance === PoolsActionStatus.PENDING
		)
			return PoolsActionStatus.PENDING
		return PoolsActionStatus.IDLE
	}, [allowance, queue])

	const content = useMemo(() => {
		switch (txStatus) {
			case PoolsActionStatus.FAILED:
			case PoolsActionStatus.REJECTED:
				return <Failure />
			case PoolsActionStatus.SUCCESS:
				return <Success />
			case PoolsActionStatus.PENDING:
				if (allowance === PoolsActionStatus.PENDING) return <Approval />
				if (queue === PoolsActionStatus.PENDING) return <Transaction />
				return null
			default:
				return null
		}
	}, [txStatus, allowance, queue])

	return content ? (
		<div className="pool_action_process_content">{content}</div>
	) : null
})
