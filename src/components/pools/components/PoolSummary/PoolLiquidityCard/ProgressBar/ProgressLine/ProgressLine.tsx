import React, { useMemo } from 'react'
import classNames from './ProgressLine.module.pcss'
import { SkeletonLoader } from '../../../../../../layout/SkeletonLoader/SkeletonLoader'

interface ProgressLineProps {
	isLoading: boolean
	width: number | string
	percent: number
	lineRef: React.RefObject<HTMLDivElement>
}

export const ProgressLine: React.FC<ProgressLineProps> = ({ isLoading, width, percent, lineRef }) => {
	const progressLineStyle = useMemo(
		() => ({
			maxWidth: width,
			width: `${percent}%`,
		}),
		[width, percent],
	)

	const progressBarStyle = useMemo(
		() => ({
			maxWidth: width,
			width: '100%',
		}),
		[width],
	)

	return isLoading ? (
		<SkeletonLoader height={8} />
	) : (
		<div ref={lineRef} className={classNames.progressBar} style={progressBarStyle}>
			<span className={classNames.progressLine} style={progressLineStyle}></span>
		</div>
	)
}
