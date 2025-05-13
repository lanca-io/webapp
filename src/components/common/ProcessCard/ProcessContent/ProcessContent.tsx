import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { Approval } from './Approval/Approval'
import { Transaction } from './Transaction/Transaction'
import { Failure } from './Failure/Failure'
import { Success } from './Success/Success'
import { useTxProcess } from '../../../../hooks/useTxProcess'
import { Status, StepType } from '@lanca/sdk'
import './ProcessContent.pcss'

export const ProcessContent: FC = memo((): JSX.Element | null => {
	const { txStatus, currentStep } = useTxProcess()

	const content = useMemo(() => {
		switch (txStatus) {
			case Status.FAILED:
				return <Failure />

			case Status.REJECTED:
				return <Failure />

			case Status.SUCCESS:
				return <Success />

			case Status.PENDING:
				if (currentStep === StepType.ALLOWANCE) return <Approval />
				if (currentStep === StepType.BRIDGE) return <Transaction />
				return null

			default:
				return null
		}
	}, [txStatus, currentStep])

	return (
		<div className="process_content" data-testid="process-content">
			{content}
		</div>
	)
})
