import type { FC } from 'react'
import './Loader.pcss'

type LoaderProps = {
	total: number
	value: number
}

export const Loader: FC<LoaderProps> = ({ total, value }) => {
	const percentage: number = Math.min(Math.max((value / total) * 100, 0), 100)

	return (
		<div className="pool_compact_loader">
			<div className="pool_compact_loader_indicator">
				<span className="pool_compact_loader_text">Filled</span>
				<span className="pool_compact_loader_value">
					{percentage.toFixed(0)}%
				</span>
			</div>
			<div
				className="pool_compact_loader_bar"
				style={
					{
						'--fill-width': `${percentage}%`,
					} as React.CSSProperties
				}
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={100}
			/>
		</div>
	)
}
