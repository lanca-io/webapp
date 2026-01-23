import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { capitalizeFirstLetter } from '@/utils/format'
import { PoolsActionStages, PoolsActionStatus } from '../../../Reducer/types'
import { Spinner } from '@concero/ui-kit'
import { SuccessIcon } from '@/assets/SuccessIcon'
import { DangerIcon } from '@/assets/DangerIcon'
import './ProcessStep.pcss'

type PoolsStepProps = {
	step: PoolsActionStages
	status: PoolsActionStatus
}

const statusIcons: Record<PoolsActionStatus, JSX.Element | null> = {
	[PoolsActionStatus.IDLE]: null,
	[PoolsActionStatus.PENDING]: <Spinner type="gray" />,
	[PoolsActionStatus.SUCCESS]: <SuccessIcon />,
	[PoolsActionStatus.FAILED]: <DangerIcon />,
	[PoolsActionStatus.REJECTED]: <DangerIcon />,
}

const stepTitles: Record<PoolsActionStages, string> = {
	[PoolsActionStages.ALLOWANCE]: 'Allowance',
	[PoolsActionStages.QUEUE]: 'Queue',
}

export const ProcessStep: FC<PoolsStepProps> = memo(({ step, status }) => {
	const stepTitle = useMemo(() => {
		return stepTitles[step] || capitalizeFirstLetter(step)
	}, [step])

	return (
		<div className="pools_action_process_step">
			{statusIcons[status]}
			<h5
				className={`pools_action_process_step_title pools_action_process_step_${status}`}
			>
				{stepTitle}
			</h5>
		</div>
	)
})
