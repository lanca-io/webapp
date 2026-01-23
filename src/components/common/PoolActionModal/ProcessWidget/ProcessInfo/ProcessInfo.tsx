import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { Alert } from '@/components/common/Alert/Alert'
import { SignIcon } from '@/assets/SignIcon'
import { DangerIcon } from '@/assets/DangerIcon'
import { usePoolsActionContext } from '../../Reducer/Provider'
import { PoolsActionStages, PoolsActionStatus } from '../../Reducer/types'
import './ProcessInfo.pcss'

export type FailureStage = PoolsActionStages.ALLOWANCE | PoolsActionStages.QUEUE

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

const FailureInfo: FC<FailureInfoProps> = memo(({ stage, reason }) => {
	const stageLabels: Record<FailureStage, string> = {
		[PoolsActionStages.ALLOWANCE]: 'Approval',
		[PoolsActionStages.QUEUE]: 'Transaction',
	}

	const reasonLabels: Record<FailureReason, string> = {
		rejected: 'Rejected',
		failed: 'Failed',
	}

	return (
		<Alert
			variant="error"
			title={`${stageLabels[stage]} ${reasonLabels[reason]}`}
			icon={<DangerIcon />}
			data-testid={`failure-alert-${stage}-${reason}`}
		/>
	)
})

export const ProcessInfo: FC = memo(() => {
	const { state } = usePoolsActionContext()
	const { allowance, queue } = state

	const isApprovalPending = allowance === PoolsActionStatus.PENDING

	const failureDetails = useMemo<FailureInfoProps | null>(() => {
		const failedStatuses = [
			PoolsActionStatus.FAILED,
			PoolsActionStatus.REJECTED,
		]
		if (failedStatuses.includes(queue)) {
			const reason: FailureReason =
				queue === PoolsActionStatus.REJECTED ? 'rejected' : 'failed'
			return { stage: PoolsActionStages.QUEUE, reason }
		}
		if (failedStatuses.includes(allowance)) {
			const reason: FailureReason =
				allowance === PoolsActionStatus.REJECTED ? 'rejected' : 'failed'
			return { stage: PoolsActionStages.ALLOWANCE, reason }
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
