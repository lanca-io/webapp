import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { capitalizeFirstLetter } from '../../../utils/new/format'
import { StepType, Status } from '@lanca/sdk'
import { Spinner } from '@concero/ui-kit'
import { SuccessIcon } from '../../../assets/icons/SuccessIcon'
import { InfoIcon } from '../../../assets/icons/InfoIcon'
import './TxStep.pcss'

type TxStepProps = {
	step: StepType
	status: Status
}

const statusIcons = {
	[Status.NOT_STARTED]: null,
	[Status.PENDING]: <Spinner type="gray" />,
	[Status.REJECTED]: <InfoIcon color="var(--color-danger-600)" />,
	[Status.FAILED]: <InfoIcon color="var(--color-danger-600)" />,
	[Status.SUCCESS]: <SuccessIcon />,
}

const stepTitles = {
	[StepType.SWITCH_CHAIN]: '',
	[StepType.ALLOWANCE]: 'Allowance',
	[StepType.SRC_SWAP]: 'Swap',
	[StepType.BRIDGE]: 'Bridge',
	[StepType.DST_SWAP]: 'Swap',
}

export const TxStep: FC<TxStepProps> = memo(({ step, status }) => {
	const stepTitle = useMemo(() => {
		return stepTitles[step] || capitalizeFirstLetter(step)
	}, [step])

	return (
		<div className="tx_step">
			{statusIcons[status]}
			<h5 className={`tx_step_title tx_step_${status}`}>{stepTitle}</h5>
		</div>
	)
})
