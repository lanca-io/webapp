import type { FC } from 'react'
import { Spinner } from '@concero/ui-kit'
import { useMemo } from 'react'
import { Data } from '../RangeChart'
import './Chart.pcss'

type ChartProps = {
	data: Data
	isLoading: boolean
	denomination?: string
}

export const Chart: FC<ChartProps> = ({
	data,
	denomination = '$',
	isLoading,
}) => {
	const containerClass = 'range_chart_visual'

	const loader = useMemo(
		() => (
			<div className="range_chart_loader">
				<Spinner type="gray" />
			</div>
		),
		[],
	)

	const progress = Math.min(1, Math.max(0, data.current / data.target))

	return (
		<div className={containerClass}>
			{isLoading ? (
				loader
			) : (
				<div className="range_chart_container">
					<div
						className="range_chart_progress_bar"
						style={
							{ '--fill-width': `${progress * 100}%` } as React.CSSProperties
						}
					/>
					<div className="range_chart_labels">
						<span className="range_chart_label">{`${denomination}0`}</span>
						<span className="range_chart_label">{`${denomination}${data.target}`}</span>
					</div>
				</div>
			)}
		</div>
	)
}
