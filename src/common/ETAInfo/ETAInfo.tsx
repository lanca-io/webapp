import type { FC } from 'react'
import { useMemo } from 'react'
import { TimeIcon } from '../../assets/icons/TimeIcon'
import './ETAInfo.pcss'

export const ETAInfo: FC = () => {
	const timeIcon = useMemo(() => <TimeIcon color="#84949B" />, [])

	return (
		<div className="eta_info">
			<div className="eta_info_description">
				{timeIcon}
				<span className="eta_info_text">ETA</span>
			</div>
			<span className="eta_info_value">20 sec.</span>
		</div>
	)
}
