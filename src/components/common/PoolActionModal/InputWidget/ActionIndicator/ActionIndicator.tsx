import type { FC } from 'react'
import { useMemo } from 'react'
import { useInputWidgetContext } from '../Reducer/Provider'
import { usePoolsActionContext } from '../../Reducer/Provider'
import { usePoolsDataStore } from '@/store/pools-data/usePoolsDataStore'
import { PoolsActionType } from '../../Reducer/types'
import { InfoIcon } from '@/assets/InfoIcon'
import { format } from '@/utils/format'
import './ActionIndicator.pcss'

export const ActionIndicator: FC = () => {
	const { state: poolsState } = usePoolsActionContext()
	const { state: inputState } = useInputWidgetContext()
	const { lpPrice } = usePoolsDataStore()

	const conditions = useMemo(() => {
		const hasWarning = Boolean(inputState.warning)
		const hasError = Boolean(inputState.error) && !hasWarning
		const showPrompt = !hasWarning && !hasError && inputState.rawInput === 0n
		const showInputValue = !hasWarning && !hasError && inputState.rawInput > 0n

		return {
			showError: hasError,
			showWarning: hasWarning,
			showPrompt,
			showInputValue,
		}
	}, [inputState.error, inputState.warning, inputState.rawInput])

	const dollarTerms = useMemo(() => {
		if (inputState.rawInput === 0n || !lpPrice) return null

		let dollars: number

		if (poolsState.type === PoolsActionType.WITHDRAWAL) {
			dollars = (Number(inputState.rawInput) / 1e6) * lpPrice
		} else {
			dollars = Number(inputState.rawInput) / 1e6
		}

		return format(dollars, 2, '$')
	}, [inputState.rawInput, poolsState.type, lpPrice])

	return (
		<div className="pool_action_indicator_container">
			{conditions.showWarning && (
				<>
					<InfoIcon color="var(--color-warning-600)" />
					<span
						className="pool_action_indicator_title pool_action_indicator_warning"
						aria-live="polite"
					>
						{inputState.warning}
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
						{inputState.error}
					</span>
				</>
			)}

			{conditions.showPrompt && (
				<span className="pool_action_indicator_title" aria-label="Input prompt">
					Enter amount
				</span>
			)}

			{conditions.showInputValue && dollarTerms && (
				<div className="pool_action_indicator_value_container">
					<span className="pool_action_indicator_title">=</span>
					<span className="pool_action_indicator_value">
						{dollarTerms ? dollarTerms : '$0'}
					</span>
				</div>
			)}
		</div>
	)
}
