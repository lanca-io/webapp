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
	denomination?: string
	isLoading?: boolean
}

export const RangeChart: FC<RangedChartProps> = memo(
	({ title, description, data, denomination = '$', isLoading = false }) => {
		return (
			<div className="range_chart">
				<ChartHeading
					title={title}
					description={description}
					total={data.current ?? 0}
					isLoading={isLoading}
					denomination={denomination}
					suffix={data.target ?? 0}
				/>
				<Chart data={data} denomination={denomination} isLoading={isLoading} />
			</div>
		)
	},
)
