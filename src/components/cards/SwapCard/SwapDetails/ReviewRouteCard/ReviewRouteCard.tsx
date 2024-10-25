import classNames from './ReviewRouteCard.module.pcss'
import { MainRouteInfoTags } from '../MainRouteInfoTags/MainRouteInfoTags'
import { Button } from '../../../../layout/buttons/Button/Button'
import { TrailArrowRightIcon } from '../../../../../assets/icons/TrailArrowRightIcon'
import { type StandardRoute } from '../../../../../types/StandardRoute'
import { type RouteData } from '../../../../../sdk/types/routeTypes'

interface ReviewRouteCardProps {
	selectedRoute: RouteData | null
}

export function ReviewRouteCard({ selectedRoute }: ReviewRouteCardProps) {
	if (!selectedRoute) return

	return (
		<div className={classNames.container}>
			<div className="gap-md">
				<MainRouteInfoTags route={selectedRoute} />
				<Button className="w-full jsb" variant="secondary" size="sm" rightIcon={<TrailArrowRightIcon />}>
					Review
				</Button>
			</div>
		</div>
	)
}
