import { memo } from 'react'
import { useFormStore } from '../../../store/form/useFormStore'
import { useValueConversion } from '../../../hooks/useValueConversion'
import { SourceValue } from '../SourceValue/SourceValue'
import { Mode } from '../../../store/form/types'
import './ValueInfo.pcss'

export const ValueInfo = memo((): JSX.Element => {
	const { error, inputValue, inputMode } = useFormStore()
	const { usd } = useValueConversion()

	const showError = !!error
	const showPrompt = inputMode === Mode.None || !inputValue.trim()
	const showIndicator = !showError && !showPrompt && usd

	return (
		<div className="value_info_container" role="status" aria-live="polite">
			{showError && (
				<span className="value_info_title value_info_error" aria-live="assertive" role="alert">
					{error}
				</span>
			)}
			{showPrompt && (
				<span className="value_info_title" aria-label="Input prompt">
					Enter amount
				</span>
			)}
			{showIndicator && <SourceValue />}
		</div>
	)
})
