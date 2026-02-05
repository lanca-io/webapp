import type { FC } from 'react'
import { memo } from 'react'
import { ChartHeading } from '../ChartHeading'
import { Chart } from './Chart/Chart'
import './RangeChart.pcss'

export type Data = {
	current: number | null
	target: number | null
}

type RangedChartProps = {
	data: Data
	title: string
	description: string
	leftDenomination?: string
	rightDenomination?: string
	isLoading?: boolean
}

export const RangeChart: FC<RangedChartProps> = memo(
	({
		title,
		description,
		data,
		leftDenomination = '',
		rightDenomination = '',
		isLoading = false,
	}) => {
		return (
			<div className="range_chart">
				<ChartHeading
					title={title}
					description={description}
					total={data.current ?? 0}
					value={data.target ?? 0}
					isLoading={isLoading}
					leftDenomination={leftDenomination}
					rightDenomination={rightDenomination}
				/>
				<Chart
					data={data}
					leftDenomination={leftDenomination}
					rightDenomination={rightDenomination}
					isLoading={isLoading}
				/>
			</div>
		)
	},
)
