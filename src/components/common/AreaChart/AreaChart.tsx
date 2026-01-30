import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { ChartHeading } from '../ChartHeading'
import { ChartRange } from '../ChartMenu'
import { Chart } from './Chart/Chart'
import './AreaChart.pcss'

export type Data = Array<{ time: string; value: number }>

type Settings = {
	isLoading: boolean
	isAdvanced?: boolean
	range?: ChartRange
	leftDenomination?: string
	rightDenomination?: string
	onChange?: (range: ChartRange) => void
}

type AreaChartProps = {
	data: Data
	title: string
	description: string
	total: number | string
	settings: Settings
}

export const AreaChart: FC<AreaChartProps> = memo(
	({
		data,
		title,
		description,
		total,
		settings: {
			isLoading,
			isAdvanced = true,
			range,
			leftDenomination = '',
			rightDenomination = '',
			onChange,
		},
	}) => {
		const chartClass = useMemo(
			() => `area_chart${!isAdvanced ? ' area_chart_compact' : ''}`,
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
					leftDenomination={leftDenomination}
					rightDenomination={rightDenomination}
					onChange={onChange}
				/>
				<Chart data={data} isAdvanced={isAdvanced} isLoading={isLoading} />
			</div>
		)
	},
)
