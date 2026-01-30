import type { FC, CSSProperties } from 'react'
import { Spinner } from '@concero/ui-kit'
import { useMemo } from 'react'
import { Data } from '../RangeChart'
import './Chart.pcss'

type ChartProps = {
	data: Data
	isLoading: boolean
	leftDenomination?: string
	rightDenomination?: string
}

export const Chart: FC<ChartProps> = ({
	data,
	leftDenomination = '',
	rightDenomination = '$',
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

	const progress = Math.min(
		1,
		Math.max(0, (data.current ?? 0) / (data.target ?? 1)),
	)

	return (
		<div className={containerClass}>
			{isLoading ? (
				loader
			) : (
				<div className="range_chart_container">
					<div
						className="range_chart_progress_bar"
						style={{ '--fill-width': `${progress * 100}%` } as CSSProperties}
					/>
					<div className="range_chart_labels">
						<span className="range_chart_label">
							{leftDenomination}
							{0}
							{rightDenomination}
						</span>
						<span className="range_chart_label">
							{leftDenomination}
							{data.target ?? 0}
							{rightDenomination}
						</span>
					</div>
				</div>
			)}
		</div>
	)
}
