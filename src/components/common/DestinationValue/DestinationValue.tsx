import { memo } from 'react'
import { useEstimatePriceImpact } from '../../../hooks/useEstimatePriceImpact'
import { ImpactSeverity } from '../../../hooks/useEstimatePriceImpact'
import { FeesDropdown } from '../FeesDropdown/FeesDropdown'
import './DestinationValue.pcss'

export const DestinationValue = memo(() => {
	const { isLoading, valueText, impact, severity } = useEstimatePriceImpact()

	if (isLoading) {
		return (
			<div className="dest_value_indicator" aria-hidden="true">
				<span className="dest_value_indicator_equal">-</span>
			</div>
		)
	}

	return (
		<div className="dest_value_indicator">
			<div className="dest_value_info">
				<span className="dest_value_indicator_equal">=</span>
				<span className="dest_value_indicator_value">{valueText ? valueText : '$0'}</span>
				{impact && <span className={`dest_value_indicator_impact ${severity}`}>({impact.text})</span>}
			</div>
			{valueText && <FeesDropdown severity={severity || ImpactSeverity.NORMAL} />}
		</div>
	)
})
