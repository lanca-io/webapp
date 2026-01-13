import type { FC } from 'react'
import type { Data } from '../BarChart'
import { ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Spinner } from '@concero/ui-kit'
import { ChartRange } from '../../ChartMenu'
import { memo } from 'react'
import './Chart.pcss'

type ChartProps = {
	data: Data
	range: ChartRange
	isLoading: boolean
}

export const Chart: FC<ChartProps> = memo(({ data, isLoading }) => {
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
						barCategoryGap={8}
						maxBarSize={86.6}
						style={{
							paddingTop: 0,
							paddingBottom: 16,
							paddingLeft: 8,
							paddingRight: 8,
						}}
					>
						<Bar
							dataKey="value"
							fill="var(--color-gray-50)"
							radius={[8, 8, 8, 8]}
							barSize={74}
							activeBar={{ fill: 'var(--color-gray-100)' }}
						/>
					</BarChart>
				</ResponsiveContainer>
			)}
		</div>
	)
})
