import type { FC } from 'react'
import type { ChartData } from '../types'
import { VolumeRange } from '../types'
import { useTickDates } from '@/hooks'
import { ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts'
import './Chart.pcss'

type ChartProps = {
	data: ChartData
	range: VolumeRange
}

export const Chart: FC<ChartProps> = ({ data, range }): JSX.Element => {
	const { formatTick } = useTickDates(range, data.length)

	return (
		<div className="rewards_chart_visual">
			<ResponsiveContainer height="100%" width="100%">
				<BarChart data={data}>
					<Bar dataKey="value" fill="var(--color-accent-100)" radius={[8, 8, 8, 8]} barSize={40} />
					<XAxis
						dataKey="time"
						type="category"
						axisLine={false}
						tickLine={false}
						tickMargin={12}
						interval="preserveStartEnd"
						tickFormatter={formatTick}
						tick={{ fontSize: 12, fill: 'var(--color-gray-500)' }}
					/>
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}
