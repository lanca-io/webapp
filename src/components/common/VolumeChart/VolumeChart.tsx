import type { FC } from 'react'
import { memo } from 'react'
import { ChartHeading } from '../ChartHeading'
import { ChartRange } from '../ChartMenu'
import { Chart } from './Chart/Chart'
import './VolumeChart.pcss'

export type Data = Array<{ time: string; value: number }>

export type VolumeChartProps = {
	data: Data
	total: number
	range: ChartRange
	isLoading: boolean
	onRangeChange: (range: ChartRange) => void
}

export const VolumeChart: FC<VolumeChartProps> = memo(
	({ data, total, range, isLoading, onRangeChange }) => (
		<div className="volume_chart">
			<ChartHeading
				title="Pools volume"
				range={range}
				tip={{
					id: 'volume_chart_info_tip',

					description: 'Total trading volume across all liquidity pools.',
				}}
				value={{ amount: total, symbol: '$' }}
				onChange={onRangeChange}
				isLoading={isLoading}
			/>
			<Chart data={data} />
		</div>
	),
)
