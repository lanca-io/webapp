import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { Alert } from '@/components/common/Alert/Alert'
import { SignIcon } from '@/assets/SignIcon'
import { DangerIcon } from '@/assets/DangerIcon'
import { usePoolsActionContext } from '../../Reducer/Provider'
import { PoolsActionStages, PoolsActionStatus } from '../../Reducer/types'
import './ProcessInfo.pcss'

export type FailureStage = PoolsActionStages.Allowance | PoolsActionStages.Queue

export type FailureReason = 'rejected' | 'failed'

export interface FailureInfoProps {
	stage: FailureStage
	reason: FailureReason
}

const ApprovalInfo: FC = memo(() => (
	<div className="pool_action_approval_info">
		<div className="pool_action_approval_info_icon">
			<SignIcon color="#097BB3" />
		</div>
		<div className="pool_action_approval_info_text">
			<p className="pool_action_approval_info_heading">Open your wallet</p>
			<p className="pool_action_approval_info_subheading">
				Signature required. Please, open your wallet and sign the transaction.
			</p>
		</div>
	</div>
))

const reasonLabels: Record<FailureReason, string> = {
	rejected: 'Transaction signature was rejected',
	failed: 'Something went wrong',
}

const reasonVariants: Record<FailureReason, 'warning' | 'error'> = {
	rejected: 'warning',
	failed: 'error',
}

const reasonColors: Record<FailureReason, string> = {
	rejected: 'var(--color-warning-600)',
	failed: 'var(--color-danger-600)',
}

export const FailureInfo: FC<FailureInfoProps> = memo(({ stage, reason }) => {
	const variant = reasonVariants[reason]
	const title = reasonLabels[reason]
	const iconColor = reasonColors[reason]

	return (
		<Alert
			variant={variant}
			title={title}
			icon={<DangerIcon color={iconColor} />}
			data-testid={`failure-alert-${stage}-${reason}`}
		/>
	)
})

export const ProcessInfo: FC = memo(() => {
	const { state } = usePoolsActionContext()
	const { allowance, queue } = state

	const isApprovalPending = allowance === PoolsActionStatus.Pending

	const failureDetails = useMemo<FailureInfoProps | null>(() => {
		const failedStatuses = [
			PoolsActionStatus.Failed,
			PoolsActionStatus.Rejected,
		]
		if (failedStatuses.includes(queue)) {
			const reason: FailureReason =
				queue === PoolsActionStatus.Rejected ? 'rejected' : 'failed'
			return { stage: PoolsActionStages.Queue, reason }
		}
		if (failedStatuses.includes(allowance)) {
			const reason: FailureReason =
				allowance === PoolsActionStatus.Rejected ? 'rejected' : 'failed'
			return { stage: PoolsActionStages.Allowance, reason }
		}
		return null
	}, [allowance, queue])

	return (
		<>
			{isApprovalPending && <ApprovalInfo />}
			{failureDetails && <FailureInfo {...failureDetails} />}
		</>
	)
})
