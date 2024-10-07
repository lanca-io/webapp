import classNames from './ReviewRouteCard.module.pcss'
import { MainRouteInfoTags } from '../../../../tags/MainRouteInfoTags/MainRouteInfoTags'
import { Button } from '../../../../buttons/Button/Button'
import { TrailArrowRightIcon } from '../../../../../assets/icons/TrailArrowRightIcon'
import { type StandardRoute } from '../../../../../types/StandardRoute'

interface ReviewRouteCardProps {
	selectedRoute: StandardRoute
}

export function ReviewRouteCard({ selectedRoute }: ReviewRouteCardProps) {
	return (
		<div className={classNames.container}>
			<div className="gap-md">
				<MainRouteInfoTags
					transactionTimeSeconds={60}
					totalGasUsd={'5.05'}
					stepsLength={selectedRoute?.steps?.length}
				/>
				<Button className="w-full jsb" variant="secondary" size="sm" rightIcon={<TrailArrowRightIcon />}>
					Review
				</Button>
			</div>

			<div className={classNames.separator}></div>
		</div>
	)
}
