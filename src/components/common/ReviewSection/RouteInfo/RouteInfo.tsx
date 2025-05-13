import { memo } from 'react'
import { PointerIcon } from '../../../../assets/icons/PointerIcon'
import { SourceInfo } from './SourceInfo/SourceInfo'
import { DestinationInfo } from './DestinationInfo/DestinationInfo'
import './RouteInfo.pcss'

export const RouteInfo = memo(
	(): JSX.Element => (
		<div className="route_info" role="region" aria-label="Transaction route details">
			<SourceInfo />
			<PointerIcon aria-hidden="true" />
			<DestinationInfo />
		</div>
	),
)
