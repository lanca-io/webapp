import type { FC } from 'react'
import { memo } from 'react'
import { ChartHeading } from '../ChartHeading'
import { ChartRange } from '../ChartMenu'
import { Chart } from './Chart/Chart'
import './AreaChart.pcss'

export type Data = Array<{ time: string; value: number }>

export type AreaChartProps = {
	data: Data
	range?: ChartRange
	isLoading: boolean
	onRangeChange?: (range: ChartRange) => void
	title: string
	total: number
	symbol?: string
	showMenu?: boolean
	tip: {
		id: string
		heading?: string
		description: string
	}
}

export const AreaChart: FC<AreaChartProps> = memo(
	({
		title,
		total,
		symbol = '$',
		data,
		range,
		isLoading,
		showMenu = true,
		onRangeChange,
		tip,
	}) => (
		<div className="area_chart">
			<ChartHeading
				title={title}
				range={range}
				tip={tip}
				value={{ amount: total, symbol }}
				onChange={onRangeChange}
				isLoading={isLoading}
				showMenu={showMenu}
			/>
			<Chart data={data} />
		</div>
	),
)
