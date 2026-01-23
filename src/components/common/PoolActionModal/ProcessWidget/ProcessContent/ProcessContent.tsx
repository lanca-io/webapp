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

	const content = useMemo(() => {
		if (
			queue === PoolsActionStatus.FAILED ||
			queue === PoolsActionStatus.REJECTED
		)
			return <Failure />
		if (queue === PoolsActionStatus.SUCCESS) return <Success />
		if (
			allowance === PoolsActionStatus.FAILED ||
			allowance === PoolsActionStatus.REJECTED
		)
			return <Failure />
		if (allowance === PoolsActionStatus.SUCCESS) return <Transaction />
		if (allowance === PoolsActionStatus.PENDING) return <Approval />
		if (queue === PoolsActionStatus.PENDING) return <Transaction />

		return null
	}, [allowance, queue])

	return content ? (
		<div className="pool_action_process_content">{content}</div>
	) : null
})
