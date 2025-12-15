import type { FC } from 'react'
import type { Data } from '../BarChart'
import { ChartRange } from '../../ChartMenu'
import { memo } from 'react'
import { useTickDates } from '@/hooks'
import { Spinner } from '@concero/ui-kit'
import { ResponsiveContainer, BarChart, Bar, XAxis } from 'recharts'
import './Chart.pcss'

type ChartProps = {
	data: Data
	range: ChartRange
	isLoading: boolean
}

export const Chart: FC<ChartProps> = memo(({ data, range, isLoading }) => {
	const { formatTick } = useTickDates(range, data.length)

	if (isLoading) {
		return (
			<div className="rewards_chart_visual">
				<div className="rewards_chart_loader">
					<Spinner type="gray" />
				</div>
			</div>
		)
	}

	return (
		<div className="rewards_chart_visual">
			<ResponsiveContainer height="100%" width="100%">
				<BarChart data={data}>
					<Bar
						dataKey="value"
						fill="var(--color-accent-100)"
						radius={[8, 8, 8, 8]}
						barSize={40}
					/>
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
})
