import { memo } from 'react'
import { TimeIcon } from '../../../assets/icons/TimeIcon'
import { useRouteStore } from '../../../store/route/useRouteStore'
import './ETAInfo.pcss'

export const ETAInfo = memo((): JSX.Element => {
	const { isLoading } = useRouteStore()

	return (
		<div className="eta_info">
			<div className="eta_info_description">
				<TimeIcon color="#84949B" aria-hidden="true" />
				<span className="eta_info_text">ETA</span>
			</div>
			<span className={`eta_info_value ${isLoading ? 'eta_info_value_loading' : ''}`}>
				{isLoading ? '-' : '20 sec.'}
			</span>
		</div>
	)
})
