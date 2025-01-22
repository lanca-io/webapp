import { Card } from '../../../../cards/Card/Card'
import { SkeletonLoader } from '../../../../layout/SkeletonLoader/SkeletonLoader'
import { toLocaleNumber } from '../../../../../utils/formatting'

import classNames from './StatCard.module.pcss'

interface StatCardProps {
	title: string
	value: number
	isLoading?: boolean
	icon: React.ReactNode
}

export const StatCard = ({ title, value, isLoading, icon }: StatCardProps) => {
	return (
		<Card className="w-full">
			<div className={classNames.content}>
				<div className={classNames.iconContainer}>{icon}</div>
				<div className={classNames.textContainer}>
					<h4 className={classNames.title}>{title}</h4>
					{isLoading ? (
						<SkeletonLoader width={128} height={24} />
					) : (
						<h3 className={classNames.value}>{toLocaleNumber(value)}</h3>
					)}
				</div>
			</div>
		</Card>
	)
}
