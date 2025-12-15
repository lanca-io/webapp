import type { FC } from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts'
import type { Data } from '../BarChart'
import { Spinner } from '@concero/ui-kit'
import { ChartRange } from '../../ChartMenu'
import { useChartDate } from '@/hooks'
import { memo } from 'react'
import { ChartTooltip } from '../../ChartTooltip'
import './Chart.pcss'

type ChartProps = {
	data: Data
	range: ChartRange
	isLoading: boolean
}

export const Chart: FC<ChartProps> = memo(({ data, range, isLoading }) => {
	const { formatDate, interval, ticks } = useChartDate(range, data)

	return (
		<div className="rewards_chart_visual">
			{isLoading ? (
				<div className="rewards_chart_loader">
					<Spinner type="gray" />
				</div>
			) : (
				<ResponsiveContainer height="100%" width="100%">
					<BarChart
						data={data}
						style={{
							paddingTop: 0,
							paddingBottom: 16,
							paddingLeft: 8,
							paddingRight: 8,
						}}
					>
						<Bar
							dataKey="value"
							fill="var(--color-accent-100)"
							radius={[8, 8, 8, 8]}
							barSize={40}
							activeBar={{ fill: 'var(--color-accent-500)' }}
						/>
						<XAxis
							dataKey="time"
							type="category"
							axisLine={false}
							tickLine={false}
							tickMargin={12}
							minTickGap={7}
							tickFormatter={formatDate}
							interval={interval}
							ticks={ticks}
							padding={{ left: 8, right: 8 }}
							tick={{ fontSize: 12, fill: 'var(--color-gray-500)' }}
						/>

						<Tooltip
							content={<ChartTooltip />}
							cursor={{ fill: 'transparent', strokeDasharray: '' }}
						/>
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	)
})
