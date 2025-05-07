import { useMemo } from 'react'
import { useFormStore } from '../../store/form/useFormStore'
import { useValueConversion } from '../../hooks/useValueConversion'
import { ValueIndicator } from '../ValueIndicator/ValueIndicator'
import { Mode } from '../../store/form/types'
import './ValueInfo.pcss'

export const ValueInfo = () => {
	const { error, inputValue, inputMode } = useFormStore()
	const { usd } = useValueConversion()

	const showError = !!error
	const showPrompt = inputMode === Mode.None || !inputValue.trim()
	const showIndicator = !showError && !showPrompt && usd

	const valueIndicator = useMemo(() => {
		if (showIndicator) {
			return <ValueIndicator />
		}
		return null
	}, [showIndicator])

	return (
		<div className="value_info_container">
			{showError && <span className="value_info_title value_info_error">{error}</span>}
			{showPrompt && <span className="value_info_title">Enter amount</span>}
			{valueIndicator}
		</div>
	)
}
