import type { FC } from 'react'
import { memo } from 'react'
import { ChartHeading } from '../ChartHeading'
import { ChartRange } from '../ChartMenu'
import { Chart } from './Chart/Chart'
import './BarChart.pcss'

export type Data = Array<{ time: string; value: number }>

export type BarChartProps = {
	data: Data
	total: number
	range: ChartRange
	isLoading: boolean
	onRangeChange: (range: ChartRange) => void
}

export const BarChart: FC<BarChartProps> = memo(
	({ data, total, range, isLoading, onRangeChange }) => {
		return (
			<div className="bar_chart">
				<ChartHeading
					title="Total rewards"
					range={range}
					tip={{
						id: 'bar_chart_info_tip',
						description:
							'Total rewards distributed to liquidity providers across all pools.',
					}}
					value={{ amount: total, symbol: '$' }}
					onChange={onRangeChange}
					isLoading={isLoading}
				/>
				<Chart data={data} range={range} isLoading={isLoading} />
			</div>
		)
	},
)
