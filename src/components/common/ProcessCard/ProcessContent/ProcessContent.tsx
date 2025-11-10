import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { Approval } from './Approval/Approval'
import { Transaction } from './Transaction/Transaction'
import { Failure } from './Failure/Failure'
import { Success } from './Success/Success'
import { useTxProcess } from '../../../../hooks/useTxProcess'
import { Status, StepType } from '@lanca/sdk'
import { trackEvent } from '../../../../hooks/useTracking'
import { useTxExecutionStore } from '../../../../store/tx-execution/useTxExecutionStore'
import { category } from '../../../../constants/tracking'
import { useRouteStore } from '../../../../store/route/useRouteStore'
import { useAccount } from 'wagmi'
import './ProcessContent.pcss'

const trackedEvents = {
	SUCCESS: false,
	FAILED: false,
	REJECTED: false,
}

export const ProcessContent: FC = memo((): JSX.Element | null => {
	const { txStatus, currentStep } = useTxProcess()
	const { srcHash } = useTxExecutionStore()
	const { route } = useRouteStore()
	const { address } = useAccount()

	const trackTxEvent = (status: string, label: string) => {
		if (trackedEvents[status as keyof typeof trackedEvents]) return

		trackedEvents[status as keyof typeof trackedEvents] = true

		trackEvent({
			category: category.SwapCard,
			action: 'transaction_status',
			label: label,
			data: {
				user_id: address,
				status: status,
				route: route,
				txHash: srcHash,
				product: 'Lanca',
			},
		})
	}

	const content = useMemo(() => {
		switch (txStatus) {
			case Status.FAILED:
				trackTxEvent('FAILED', 'Transaction failed')
				return <Failure />

			case Status.REJECTED:
				trackTxEvent('REJECTED', 'Transaction rejected')
				return <Failure />

			case Status.SUCCESS:
				trackTxEvent('SUCCESS', 'Transaction successful')
				return <Success />

			case Status.PENDING:
				if (currentStep === StepType.ALLOWANCE) return <Approval />
				if (currentStep === StepType.BRIDGE) return <Transaction />
				if (currentStep === StepType.SRC_SWAP) return <Transaction />
				if (currentStep === StepType.DST_SWAP) return <Transaction />
				return null

			default:
				return null
		}
	}, [txStatus, currentStep, srcHash])

	return (
		<div className="process_content" data-testid="process-content">
			{content}
		</div>
	)
})
