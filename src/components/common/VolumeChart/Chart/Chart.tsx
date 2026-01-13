import type { FC } from 'react'
import type { DataPoint } from '../types'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import './Chart.pcss'

type ChartProps = {
	data: DataPoint[]
}

export const Chart: FC<ChartProps> = ({ data }): JSX.Element => {
	return (
		<div className="volume_chart_visual">
			<ResponsiveContainer height="100%" width="100%">
				<AreaChart data={data}>
					<defs>
						<linearGradient
							id="volumeGradient"
							x1="0%"
							y1="100%"
							x2="0%"
							y2="0%"
						>
							<stop
								offset="0%"
								stopColor="var(--color-gray-25)"
								stopOpacity={1}
							/>
							<stop
								offset="100%"
								stopColor="var(--color-gray-50)"
								stopOpacity={1}
							/>
						</linearGradient>
					</defs>
					<Area
						type="monotone"
						dataKey="value"
						stroke="var(--color-gray-50)"
						strokeWidth={2}
						fill="url(#volumeGradient)"
					/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	)
}
