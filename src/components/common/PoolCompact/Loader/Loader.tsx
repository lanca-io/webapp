import type { FC } from 'react'
import { SkeletonLoader } from '../../SkeletonLoader'
import './Loader.pcss'

type LoaderProps = {
	cap: number
	tvl: number
	isLoading: boolean
}

export const Loader: FC<LoaderProps> = ({ tvl, cap, isLoading = false }) => {
	if (isLoading)
		return (
			<SkeletonLoader
				width={128}
				height={32}
				className="pool_compact_loader_skeleton"
			/>
		)

	const percent = Number.isNaN(tvl / cap) ? 0 : (tvl / cap) * 100
	const rate = Math.min(Math.max(percent, 0), 100)
	const isFull = Number.isNaN(tvl / cap) ? false : tvl >= cap

	return (
		<div
			className={`pool_compact_loader ${isFull ? 'pool_compact_loader--full' : ''}`}
		>
			<div className="pool_compact_loader_indicator">
				<span className="pool_compact_loader_text">Filled</span>
				<span className="pool_compact_loader_value">{rate.toFixed(0)}%</span>
			</div>
			<div
				className="pool_compact_loader_bar"
				style={{ '--fill-width': `${rate}%` } as React.CSSProperties}
				role="progressbar"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={rate}
			/>
		</div>
	)
}
