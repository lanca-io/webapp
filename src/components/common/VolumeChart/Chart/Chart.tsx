import type { FC } from 'react'
import type { ChartData } from '../types'
import { VolumeRange } from '../types'
import { useTickDates } from '@/hooks'
import { AreaChart, Area, ResponsiveContainer, XAxis } from 'recharts'
import './Chart.pcss'

type ChartProps = {
	data: ChartData
	range: VolumeRange
}

export const Chart: FC<ChartProps> = ({ data, range }): JSX.Element => {
	const { formatTick } = useTickDates(range, data.length)

	return (
		<div className="volume_chart_visual">
			<ResponsiveContainer height="100%" width="100%">
				<AreaChart data={data}>
					<defs>
						<linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
							<stop
								offset="20.76%"
								stopColor="var(--color-accent-100)"
								stopOpacity={1}
							/>
							<stop
								offset="99.62%"
								stopColor="var(--color-gray-25)"
								stopOpacity={1}
							/>
						</linearGradient>
					</defs>
					<Area
						type="monotone"
						dataKey="value"
						stroke="var(--color-accent-400)"
						strokeWidth={2}
						fill="url(#volumeGradient)"
						activeDot={{
							r: 6,
							stroke: 'var(--color-accent-600)',
							strokeWidth: 2,
						}}
					/>
					<XAxis
						dataKey="time"
						type="category"
						axisLine={false}
						tickLine={false}
						tickMargin={12}
						minTickGap={0}
						tickFormatter={formatTick}
						tick={{ fontSize: 12, fill: 'var(--color-gray-500)' }}
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}
