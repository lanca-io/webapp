import classNames from './ChartCard.module.pcss'
import { type Dispatch, type SetStateAction } from 'react'
import { BarChart } from '../Charts/BarChart/BarChart'
import { Loader } from '../../layout/Loader/Loader'
import { SkeletonLoader } from '../../layout/SkeletonLoader/SkeletonLoader'
import { InfoTooltip } from '../../layout/InfoTooltip/InfoTooltip'
import { Card } from '../../cards/Card/Card'
import { Chart } from '../Charts/Chart/Chart'
import { Button } from '../buttons/Button/Button'
import { type ChartData } from '../Charts/Chart/Chart'

type TimeOption = 'M' | '3M' | 'All'

export interface SelectItem {
	title: string
	value: TimeOption
	startTime: number | null
	endTime: number | null
}

export interface BarChartCardProps {
	description?: string
	titleCard: string
	subtitle?: string
	filterItems?: SelectItem[]
	activeItem?: SelectItem
	setActiveItem?: Dispatch<SetStateAction<SelectItem>>
	commonValue: string | number | undefined
	data: ChartData[]
	className?: string
	footer?: React.ReactNode
	isBar?: boolean
	height?: number
	size?: 'S' | 'M'
	isLoading: boolean
	showTooltip?: boolean
	symbol?: 'dollar' | 'percent'
}

export const ChartCard = ({
	description,
	titleCard,
	subtitle,
	activeItem,
	setActiveItem,
	filterItems,
	commonValue,
	data,
	className,
	footer,
	isBar = false,
	height,
	size,
	isLoading,
	showTooltip = true,
	symbol = 'dollar',
}: BarChartCardProps) => {
	const isSmall = size === 'S'

	const chart = isBar ? <BarChart height={height} data={data} /> : <Chart data={data} symbol={symbol} />

	const title =
		commonValue && isSmall ? (
			<h3 className={classNames.smallValue}>{commonValue}</h3>
		) : (
			<h2 className={classNames.value}>{commonValue}</h2>
		)

	return (
		<Card className={`${className} jsb`}>
			<div>
				<div className={classNames.header}>
					<div className="row gap-sm ac">
						{!isSmall ? (
							<h4 className={classNames.title}>{titleCard}</h4>
						) : (
							<h4 className={classNames.smallTitle}>{titleCard}</h4>
						)}
						{description && showTooltip && <InfoTooltip description={description} tooltipId={titleCard} />}
					</div>
					<div className="row gap-xs">
						{setActiveItem &&
							filterItems?.map(filterItem => {
								const isActive = filterItem.value === activeItem?.value
								return (
									<Button
										key={filterItem.value}
										onClick={() => {
											setActiveItem(filterItem)
										}}
										variant={`${isActive ? 'secondary' : 'tetrary'}`}
										size="sm"
									>
										{filterItem.title}
									</Button>
								)
							})}
					</div>
				</div>

				{isLoading ? <SkeletonLoader className={classNames.value} width={150} height={32} /> : title}

				{subtitle && isLoading ? <SkeletonLoader width={105} height={20} /> : <p>{subtitle}</p>}
			</div>

			{isLoading ? (
				<div className="w-full h-full ac jc">
					<Loader variant="neutral" />
				</div>
			) : (
				chart
			)}

			{footer}
		</Card>
	)
}
