import { useState, useMemo } from 'react'
import { type Fee } from '../../../hooks/useGetFees'
import { createTimeFilters } from '../../../../../utils/chartTimeFilters'
import { ChartCard } from '../../../../layout/ChartCard/ChartCard'
import { useGetTotalVolume } from '../../../hooks/useGetTotalVolume'
import classNames from './VolumeCard.module.pcss'
import { toLocaleNumber } from '../../../../../utils/formatting'

interface VolumeCardProps {
	fees: Fee[]
	isLoading: boolean
}

const description = 'Total volume of cross-chain transactions using the liquidity of the pool'

export const VolumeCard = ({ fees, isLoading }: VolumeCardProps): JSX.Element => {
	const timeFilters = useMemo(() => createTimeFilters(), [])
	const [activeFilter, setActiveFilter] = useState(timeFilters[timeFilters.length - 1])
	const { totalVolume, volumeData } = useGetTotalVolume(fees, activeFilter)

	return (
		<ChartCard
			description={description}
			isLoading={isLoading}
			className={classNames.totalVolumeCard}
			titleCard="Total volume"
			filterItems={timeFilters}
			activeItem={activeFilter}
			setActiveItem={setActiveFilter}
			data={volumeData}
			commonValue={`$${toLocaleNumber(totalVolume)}`}
		/>
	)
}
