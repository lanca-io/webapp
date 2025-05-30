import { FC, memo, useMemo, Fragment } from 'react'
import { RightIcon } from '../../../assets/icons/RightIcon'
import { TxStep } from '../TxStep/TxStep'
import { useTxExecutionStore } from '../../../store/tx-execution/useTxExecutionStore'
import { Status } from '@lanca/sdk'
import './TxProgress.pcss'

export const TxProgress: FC = memo((): JSX.Element | null => {
	const { overallStatus, steps } = useTxExecutionStore()

	const stepsContent = useMemo(
		() => (
			<>
				{steps.map((step, index) => (
					<Fragment key={`${step.type}-${index}`}>
						<TxStep step={step.type} status={step.status} />
						{index < steps.length - 1 && <RightIcon color="var(--color-grey-300)" />}
					</Fragment>
				))}
			</>
		),
		[steps],
	)

	if (overallStatus === Status.SUCCESS || steps.length === 0) return null

	return (
		<div className="tx_progress" data-testid="tx-progress">
			{stepsContent}
		</div>
	)
})
