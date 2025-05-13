import { memo } from 'react'
import { GasIcon } from '../../../assets/icons/GasIcon'
import './GasInfo.pcss'

export const GasInfo = memo(
	(): JSX.Element => (
		<div className="gas_info" role="status" aria-live="polite">
			<div className="gas_info_description">
				<GasIcon color="#84949B" aria-hidden="true" />
				<span className="gas_info_text">Gas to pay</span>
			</div>
			<span className="gas_info_value" aria-label="Estimated gas cost">
				$0.01
			</span>
		</div>
	),
)
