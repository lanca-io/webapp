import type { FC } from 'react'
import type { Data } from '../AreaChart'
import {
	AreaChart as RechartsAreaChart,
	Area,
	ResponsiveContainer,
} from 'recharts'
import { Spinner } from '@concero/ui-kit'
import { useMemo } from 'react'
import './Chart.pcss'

type ChartProps = {
	data: Data
	isAdvanced: boolean
	isLoading: boolean
}

export const Chart: FC<ChartProps> = ({ data, isAdvanced, isLoading }) => {
	const containerClass: string = useMemo(
		() => `area_chart_visual${!isAdvanced ? ' area_chart_visual_compact' : ''}`,
		[isAdvanced],
	)

	const loader = useMemo(
		() => (
			<div className="area_chart_loader">
				{' '}
				// area_chart_loader
				<Spinner type="gray" />
			</div>
		),
		[],
	)

	return (
		<div className={containerClass}>
			{isLoading ? (
				loader
			) : (
				<ResponsiveContainer height="100%" width="100%">
					<RechartsAreaChart
						data={data}
						style={{
							paddingTop: 0,
							paddingBottom: 16,
							paddingLeft: 8,
							paddingRight: 8,
						}}
					>
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
					</RechartsAreaChart>
				</ResponsiveContainer>
			)}
		</div>
	)
}
