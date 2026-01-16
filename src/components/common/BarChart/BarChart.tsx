import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { ChartHeading } from '../ChartHeading'
import { ChartRange } from '../ChartMenu'
import { Chart } from './Chart/Chart'
import './BarChart.pcss'

export type Data = Array<{ time: string; value: number }>

type Settings = {
	isLoading: boolean
	isAdvanced?: boolean
	range?: ChartRange
	denomination?: string
	suffix?: number | string
	onChange?: (range: ChartRange) => void
}

type BarChartProps = {
	data: Data
	title: string
	description: string
	total: number | string
	settings: Settings
}

export const BarChart: FC<BarChartProps> = memo(
	({
		data,
		title,
		description,
		total,
		settings: {
			isLoading,
			isAdvanced = true,
			range,
			denomination = '$',
			suffix = '',
			onChange,
		},
	}) => {
		const chartClass: string = useMemo(
			() => `bar_chart${!isAdvanced ? ' bar_chart_compact' : ''}`,
			[isAdvanced],
		)

		return (
			<div className={chartClass}>
				<ChartHeading
					title={title}
					description={description}
					total={total}
					isLoading={isLoading}
					range={range}
					isAdvanced={isAdvanced}
					denomination={denomination}
					suffix={suffix}
					onChange={onChange}
				/>
				<Chart data={data} isAdvanced={isAdvanced} isLoading={isLoading} />
			</div>
		)
	},
)
