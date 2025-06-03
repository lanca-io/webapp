import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { Approval } from './Approval/Approval'
import { Transaction } from './Transaction/Transaction'
import { Failure } from './Failure/Failure'
import { Success } from './Success/Success'
import { useTxProcess } from '../../../../hooks/useTxProcess'
import { Status, StepType } from '@lanca/sdk'
import { trackEvent } from '../../../../hooks/useTracking'
import { useFormStore } from '../../../../store/form/useFormStore'
import { useTxExecutionStore } from '../../../../store/tx-execution/useTxExecutionStore'
import { action, category } from '../../../../constants/tracking'
import './ProcessContent.pcss'

const trackedEvents = {
	SUCCESS: false,
	FAILED: false,
	REJECTED: false,
}

export const ProcessContent: FC = memo((): JSX.Element | null => {
	const { txStatus, currentStep } = useTxProcess()
	const { fromToken, toToken, fromChain, toChain } = useFormStore()
	const { srcHash, dstHash } = useTxExecutionStore()

	const trackTxEvent = (eventType: string, eventData: any) => {
		if (trackedEvents[eventType as keyof typeof trackedEvents]) {
			return
		}
		trackedEvents[eventType as keyof typeof trackedEvents] = true
		trackEvent(eventData)
	}

	const content = useMemo(() => {
		switch (txStatus) {
			case Status.FAILED:
				trackTxEvent('FAILED', {
					category: category.SwapCard,
					action: action.SwapFailed,
					label: action.SwapFailed,
					data: {
						fromToken: fromToken,
						toToken: toToken,
						fromChain: fromChain,
						toChain: toChain,
						srcHash: srcHash,
						dstHash: dstHash,
					},
				})
				return <Failure />

			case Status.REJECTED:
				trackTxEvent('REJECTED', {
					category: category.SwapCard,
					action: action.SwapRejected,
					label: action.SwapRejected,
					data: {
						fromToken: fromToken,
						toToken: toToken,
						fromChain: fromChain,
						toChain: toChain,
						srcHash: srcHash,
						dstHash: dstHash,
					},
				})
				return <Failure />

			case Status.SUCCESS:
				trackTxEvent('SUCCESS', {
					category: category.SwapCard,
					action: action.SwapSuccess,
					label: 'swap_success',
					data: {
						fromToken: fromToken,
						toToken: toToken,
						fromChain: fromChain,
						toChain: toChain,
						srcHash: srcHash,
						dstHash: dstHash,
					},
				})
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
