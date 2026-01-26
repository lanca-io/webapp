import type { FC } from 'react'
import { useMemo } from 'react'
import { useInputWidgetContext } from '../Reducer/Provider'
import { InfoIcon } from '@/assets/InfoIcon'
import './ActionIndicator.pcss'

export const ActionIndicator: FC = () => {
	const { state } = useInputWidgetContext()

	const conditions = useMemo(() => {
		const showError = Boolean(state.error)
		const showWarning = Boolean(state.warning) && !showError
		const showPrompt = state.rawInput === 0n

		return { showError, showWarning, showPrompt }
	}, [
		state.error,
		state.warning,
		state.isTouched,
		state.rawInput,
		state.isFocused,
	])

	return (
		<div className="pool_action_indicator_container">
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

			{conditions.showPrompt && (
				<span className="pool_action_indicator_title" aria-label="Input prompt">
					Enter amount
				</span>
			)}
		</div>
	)
}
