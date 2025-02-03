import { useMemo } from 'react'
import classNames from './ReviewRoute.module.pcss'
import { RouteInfo } from '../RouteInfo/RouteInfo'
import { Button } from '../../../../layout/buttons/Button/Button'
import { TrailArrowRightIcon } from '../../../../../assets/icons/TrailArrowRightIcon'
import { type IRouteType } from 'lanca-sdk-demo'

interface ReviewRouteProps {
	selectedRoute: IRouteType | null
}

export function ReviewRoute({ selectedRoute }: ReviewRouteProps) {
	if (!selectedRoute) return null

	const memoizedRouteInfo = useMemo(() => <RouteInfo route={selectedRoute} />, [selectedRoute])

	return (
		<div className={classNames.container}>
			<div className="gap-md">
				{memoizedRouteInfo}
				<Button className="w-full jsb" variant="secondary" size="md" rightIcon={<TrailArrowRightIcon />}>
					Review
				</Button>
			</div>
		</div>
	)
}
