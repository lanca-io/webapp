import { createTimeFilters } from '../../../../../utils/chartTimeFilters'
import { useMemo, useState } from 'react'
import { ChartCard } from '../../../../layout/ChartCard/ChartCard'
import classNames from './RewardsCard.module.pcss'
import { useGetWeeklyVolume } from '../../../hooks/useGetWeeklyVolume'
import type { Fee } from '../../../hooks/useGetFees'

type Size = 'small' | 'medium'

interface Props {
	fees: Fee[]
	title?: string
	isLoading: boolean
	withFilter?: boolean
	height?: number
	size?: Size
	className?: string
	showTooltip?: boolean
}

const REWARDS_DESCRIPTION =
	"The pool receives a fee of 0.1% of the transaction amount for each cross-chain transaction executed using the pool's liquidity. These fees are shared proportionally between all LP providers in the pool."

export const RewardsCard = ({
	fees,
	isLoading,
	withFilter = true,
	height,
	className = '',
	title = 'Rewards',
	size = 'medium',
	showTooltip = true,
}: Props) => {
	const timeFilters = useMemo(() => createTimeFilters(), [])
	const [activeFilter, setActiveFilter] = useState(timeFilters[timeFilters.length - 1])

	const {
		groupedVolumeData,
		totalVolumeFormatted,
		isLoading: isVolumeLoading,
	} = useGetWeeklyVolume(fees, activeFilter)

	const filterProps = useMemo(
		() =>
			withFilter
				? {
						filterItems: timeFilters,
						activeItem: activeFilter,
						setActiveItem: setActiveFilter,
					}
				: {},
		[withFilter, timeFilters, activeFilter],
	)

	const sizeValue = size === 'small' ? 'S' : 'M'

	return (
		<ChartCard
			description={REWARDS_DESCRIPTION}
			isLoading={isLoading || isVolumeLoading}
			className={`${classNames.rewardsCard} ${className}`.trim()}
			titleCard={title}
			data={groupedVolumeData}
			commonValue={totalVolumeFormatted}
			isBar={true}
			{...filterProps}
			height={height}
			size={sizeValue}
			showTooltip={showTooltip}
		/>
	)
}
