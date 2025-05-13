import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { ProcessHeading } from './ProcessHeading/ProcessHeading'
import { TxProgress } from '../TxProgress/TxProgress'
import { ProcessContent } from './ProcessContent/ProcessContent'
import { ProcessInfo } from './ProcessInfo/ProcessInfo'
import { ProcessAction } from './ProcessAction/ProcessAction'
import { useTxProcess } from '../../../hooks/useTxProcess'
import { StepType, Status } from '@lanca/sdk'
import './ProcessCard.pcss'

export const ProcessCard: FC = memo(() => {
	const { currentStep, currentStage, txStatus } = useTxProcess()

	const isTxPending = useMemo(
		() =>
			(currentStep === StepType.BRIDGE ||
				currentStep === StepType.SRC_SWAP ||
				currentStep === StepType.DST_SWAP) &&
			txStatus === Status.PENDING,
		[currentStep, txStatus],
	)

	return (
		<>
			<div className={`process_card_${currentStage}`}>
				<div className={`process_card ${isTxPending ? 'pending' : ''}`}>
					<ProcessHeading />
					<ProcessContent />
					<TxProgress />
					<ProcessInfo />
				</div>
			</div>
			<ProcessAction />
		</>
	)
})
