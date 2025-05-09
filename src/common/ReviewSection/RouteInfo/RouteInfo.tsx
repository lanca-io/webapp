import type { FC } from 'react'
import { useMemo } from 'react'
import { PointerIcon } from '../../../assets/icons/PointerIcon'
import { SourceInfo } from './SourceInfo/SourceInfo'
import { DestinationInfo } from './DestinationInfo/DestinationInfo'
import './RouteInfo.pcss'

export const RouteInfo: FC = () => {
	const sourceInfo = useMemo(() => <SourceInfo />, [])
	const destinationInfo = useMemo(() => <DestinationInfo />, [])
	const pointerIcon = useMemo(() => <PointerIcon />, [])

	return (
		<div className="route_info">
			{sourceInfo}
			{pointerIcon}
			{destinationInfo}
		</div>
	)
}
