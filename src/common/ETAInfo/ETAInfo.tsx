import { memo } from 'react'
import { TimeIcon } from '../../assets/icons/TimeIcon'
import './ETAInfo.pcss'

export const ETAInfo = memo(
	(): JSX.Element => (
		<div className="eta_info" role="status" aria-live="polite">
			<div className="eta_info_description">
				<TimeIcon color="#84949B" aria-hidden="true" />
				<span className="eta_info_text">ETA</span>
			</div>
			<span className="eta_info_value" aria-label="Estimated time to arrival">
				20 sec.
			</span>
		</div>
	),
)
