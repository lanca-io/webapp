import type { FC } from 'react'
import { memo, useCallback } from 'react'
import { IconButton } from '@concero/ui-kit'
import { LeftIcon } from '../../../../assets/icons/LeftIcon'
import { useTxProcess } from '../../../../hooks/useTxProcess'
import { useProcessHeading } from '../../../../hooks/useProcessHeading'
import { useTxExecutionStore } from '../../../../store/tx-execution/useTxExecutionStore'
import { useFormStore } from '../../../../store/form/useFormStore'
import './ProcessHeading.pcss'

export const ProcessHeading: FC = memo(() => {
	const { clearInputs } = useFormStore()
	const { reset } = useTxExecutionStore()
	const { isTerminalStage } = useTxProcess()
	const heading = useProcessHeading()

	const handleReset = useCallback(() => {
		reset()
		clearInputs()
	}, [reset, clearInputs])

	return (
		<div className={`process_card_heading ${!isTerminalStage ? 'process_card_heading_no_button' : ''}`}>
			{isTerminalStage && (
				<IconButton onClick={handleReset} variant="secondary" size="m" aria-label="Back to swap">
					<LeftIcon />
				</IconButton>
			)}
			<h4 className="process_card_title" data-testid="process-heading">
				{heading}
			</h4>
		</div>
	)
})
