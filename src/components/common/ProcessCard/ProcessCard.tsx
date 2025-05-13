import type { FC } from 'react'
import { memo } from 'react'
import { ProcessHeading } from './ProcessHeading/ProcessHeading'
import { TxProgress } from '../TxProgress/TxProgress'
import { ProcessContent } from './ProcessContent/ProcessContent'
import { ProcessInfo } from './ProcessInfo/ProcessInfo'
import { ProcessAction } from './ProcessAction/ProcessAction'
import { useTxProcess } from '../../../hooks/useTxProcess'
import { StepType } from '@lanca/sdk'
import { Status } from '@lanca/sdk'
import './ProcessCard.pcss'

export const ProcessCard: FC = memo((): JSX.Element => {
	const { currentStep, currentStage, txStatus } = useTxProcess()

	const isBridgePending = currentStep === StepType.BRIDGE && txStatus === Status.PENDING

	return (
		<>
			<div className={`process_card_${currentStage}`} data-testid={`process-card-${currentStage}`}>
				<div className={`process_card ${isBridgePending ? 'pending' : ''}`}>
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
