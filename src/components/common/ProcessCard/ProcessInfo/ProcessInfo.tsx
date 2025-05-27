import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { useTxExecutionStore } from '../../../../store/tx-execution/useTxExecutionStore'
import { Status, StepType } from '@lanca/sdk'
import { Alert } from '../../Alert/Alert'
import { SignIcon } from '../../../../assets/icons/SignIcon'
import { DangerIcon } from '../../../../assets/icons/DangerIcon'
import './ProcessInfo.pcss'

export type FailureStep = StepType.ALLOWANCE | StepType.BRIDGE | StepType.SRC_SWAP | StepType.DST_SWAP

export type FailureReason = 'rejected' | 'failed'

export interface FailureInfoProps {
	step: FailureStep
	reason: FailureReason
}

const ApprovalInfo: FC = memo(() => (
	<div className="approval_info">
		<div className="approval_info_icon">
			<SignIcon color="#097BB3" />
		</div>
		<div className="approval_info_text">
			<p className="approval_info_heading">Open your wallet</p>
			<p className="approval_info_subheading">
				Signature required. Please, open your wallet and sign the transaction.
			</p>
		</div>
	</div>
))

const FailureInfo: FC<FailureInfoProps> = memo(({ step, reason }) => {
	const stepLabels: Record<FailureStep, string> = {
		[StepType.ALLOWANCE]: 'Approval',
		[StepType.BRIDGE]: 'Bridge',
		[StepType.SRC_SWAP]: 'Swap',
		[StepType.DST_SWAP]: 'Swap',
	}

	const reasonLabels: Record<FailureReason, string> = {
		rejected: 'Rejected',
		failed: 'Failed',
	}

	return (
		<Alert
			variant="error"
			title={`${stepLabels[step]} ${reasonLabels[reason]}`}
			icon={<DangerIcon />}
			data-testid={`failure-alert-${step}-${reason}`}
		/>
	)
})

export const ProcessInfo: FC = memo(() => {
	const { steps, overallStatus } = useTxExecutionStore()

	const currentStep = useMemo(() => {
		return steps.find(
			step => step.status === Status.PENDING || step.status === Status.REJECTED || step.status === Status.FAILED,
		)?.type
	}, [steps])

	const isFailureStep = (step?: StepType): step is FailureStep => {
		return !!step && [StepType.ALLOWANCE, StepType.BRIDGE, StepType.SRC_SWAP, StepType.DST_SWAP].includes(step)
	}

	const failureDetails = useMemo<FailureInfoProps | null>(() => {
		if ([Status.REJECTED, Status.FAILED].includes(overallStatus)) {
			const reason: FailureReason = overallStatus === Status.REJECTED ? 'rejected' : 'failed'
			if (isFailureStep(currentStep)) {
				return { step: currentStep, reason }
			}
		}
		return null
	}, [overallStatus, currentStep])

	const isApprovalPending = steps.some(s => s.type === StepType.ALLOWANCE && s.status === Status.PENDING)

	return (
		<>
			{isApprovalPending && <ApprovalInfo />}
			{failureDetails && <FailureInfo {...failureDetails} />}
		</>
	)
})
