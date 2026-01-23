import type { FC } from 'react'
import { memo, useMemo, Fragment } from 'react'
import { RightIcon } from '@/assets/RightIcon'
import { usePoolsActionContext } from '../../Reducer/Provider'
import { PoolsActionStages, PoolsActionStatus } from '../../Reducer/types'
import { ProcessStep } from './ProcessStep/ProcessStep'
import './ProcessStatus.pcss'

export const ProcessStatus: FC = memo(() => {
	const { state } = usePoolsActionContext()
	const { allowance, queue } = state

	const steps = useMemo(
		() => [
			{ type: PoolsActionStages.ALLOWANCE, status: allowance },
			{ type: PoolsActionStages.QUEUE, status: queue },
		],
		[allowance, queue],
	)

	const stepsContent = useMemo(
		() => (
			<Fragment>
				{steps.map((step, index) => (
					<Fragment key={`${step.type}-${index}`}>
						<ProcessStep step={step.type} status={step.status} />
						{index < steps.length - 1 && (
							<RightIcon color="var(--color-gray-300)" />
						)}
					</Fragment>
				))}
			</Fragment>
		),
		[steps],
	)

	const isComplete =
		queue === PoolsActionStatus.SUCCESS ||
		(allowance === PoolsActionStatus.IDLE && queue === PoolsActionStatus.IDLE)
	if (isComplete) return null

	return (
		<div className="pools_action_progress" data-testid="pools-progress">
			{stepsContent}
		</div>
	)
})
