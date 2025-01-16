import { Bar, BarChart as ReBarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { type FC, useMemo } from 'react'
import { type ChartData } from '../Chart/Chart'
import dayjs from 'dayjs'
import classNames from './BarChart.module.pcss'

export interface BarChartProps {
	data: ChartData[]
	height?: number
}

interface CustomTooltipProps {
	active?: boolean
	payload?: any[]
	label?: string
}

const CustomTooltip: FC<CustomTooltipProps> = ({ active, payload, label }) => {
	if (active && payload?.length) {
		return (
			<div className={classNames.tooltip} style={{ display: 'flex' }}>
				<b>${payload[0].value}</b>
				<p>{label}</p>
			</div>
		)
	}

	return null
}

export const BarChart: FC<BarChartProps> = ({ data, height = 200 }) => {
	const formattedData = useMemo(() => {
		return data.map(item => ({
			value: Number(item.value.toFixed(2)),
			time: dayjs(item.time).format('DD MMM. YYYY'),
		}))
	}, [data])

	return (
		<ResponsiveContainer width="100%" height={height}>
			<ReBarChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }} width={150} data={formattedData}>
				<defs>
					<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stopColor="#ACE1FB" stopOpacity={1} />
						<stop offset="100%" stopColor="#EFF9FE" stopOpacity={1} />
					</linearGradient>
				</defs>
				<Bar dataKey="value" radius={8} activeBar={{ fill: '#0c9fe8' }}>
					{formattedData.map((_, index) => (
						<Cell key={`cell-${index}`} fill="url(#colorUv)" />
					))}
				</Bar>
				<Tooltip content={<CustomTooltip />} cursor={{ fill: 'transparent' }} />
				<XAxis dataKey="time" axisLine={false} tickLine={false} padding="gap" />
			</ReBarChart>
		</ResponsiveContainer>
	)
}
