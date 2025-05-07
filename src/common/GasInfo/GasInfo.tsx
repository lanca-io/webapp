import type { FC } from 'react'
import { useMemo } from 'react'
import { GasIcon } from '../../assets/icons/GasIcon'
import { useEstimateGas } from '../../hooks/useEstimateGas'
import './GasInfo.pcss'

export const GasInfo: FC = () => {
	useEstimateGas()
	const gasIcon = useMemo(() => <GasIcon color="#84949B" />, [])

	return (
		<div className="gas_info">
			<div className="gas_info_description">
				{gasIcon}
				<span className="gas_info_text">Gas to pay</span>
			</div>
			<span className="gas_info_value">$0.01</span>
		</div>
	)
}
