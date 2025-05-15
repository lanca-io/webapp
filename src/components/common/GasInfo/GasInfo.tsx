import { memo } from 'react'
import { GasIcon } from '../../../assets/icons/GasIcon'
import { useEstimateGas } from '../../../hooks/useEstimateGas'
import { format } from '../../../utils/new/format'
import './GasInfo.pcss'

export const GasInfo = memo((): JSX.Element => {
	const { estimate } = useEstimateGas()
	const gas = estimate ? format(estimate?.usd, 2, '$') : '-'

	return (
		<div className="gas_info">
			<div className="gas_info_description">
				<GasIcon color="#84949B" />
				<span className="gas_info_text">Gas to pay</span>
			</div>
			<span className="gas_info_value">{gas}</span>
		</div>
	)
})
