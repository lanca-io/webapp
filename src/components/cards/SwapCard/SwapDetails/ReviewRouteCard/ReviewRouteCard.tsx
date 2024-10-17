import classNames from './ReviewRouteCard.module.pcss'
import { MainRouteInfoTags } from '../../../../tags/MainRouteInfoTags/MainRouteInfoTags'
import { Button } from '../../../../layout/buttons/Button/Button'
import { TrailArrowRightIcon } from '../../../../../assets/icons/TrailArrowRightIcon'
import { type StandardRoute } from '../../../../../types/StandardRoute'

interface ReviewRouteCardProps {
	selectedRoute: StandardRoute | null
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
