import type { FC } from 'react'
import { useMemo } from 'react'
import { useInputWidgetContext } from '../Reducer/Provider'
import { InfoIcon } from '@/assets/InfoIcon'
import './ActionIndicator.pcss'

export const ActionIndicator: FC = () => {
	const { state } = useInputWidgetContext()

	const conditions = useMemo(() => {
		const hasWarning = Boolean(state.warning)
		const hasError = Boolean(state.error) && !hasWarning
		const showPrompt = !hasWarning && !hasError && state.rawInput === 0n

		return {
			showError: hasError,
			showWarning: hasWarning,
			showPrompt,
		}
	}, [state.error, state.warning, state.rawInput])

	return (
		<div className="pool_action_indicator_container">
			{conditions.showWarning && (
				<>
					<InfoIcon color="var(--color-warning-600)" />
					<span
						className="pool_action_indicator_title pool_action_indicator_warning"
						aria-live="polite"
					>
						{state.warning}
					</span>
				</>
			)}

			{conditions.showError && (
				<>
					<InfoIcon color="var(--color-danger-600)" />
					<span
						className="pool_action_indicator_title pool_action_indicator_error"
						aria-live="assertive"
						role="alert"
					>
						{state.error}
					</span>
				</>
			)}

			{conditions.showPrompt && (
				<span className="pool_action_indicator_title" aria-label="Input prompt">
					Enter amount
				</span>
			)}
		</div>
	)
}
