import React, { useMemo } from 'react'
import classNames from './ProgressBar.module.pcss'
import { toLocaleNumber } from '../../../../../../utils/formatting'
import { Tag } from '../../../../../layout/Tag/Tag'
import { SkeletonLoader } from '../../../../../layout/SkeletonLoader/SkeletonLoader'
import { ProgressValue } from './ProgressValue/ProgressValue'
import { ProgressLine } from './ProgressLine/ProgressLine'
import { ProgressRange } from './ProgressRange/ProgressRange'
import { useProgressBar } from './useProgressBar'

export interface ProgressBarProps {
	type?: 'big' | 'medium' | 'float'
	width?: number | string
	symbol?: string
	isLoading?: boolean
	minValue?: number
	currentValue: number
	maxValue: number
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
	width = '100%',
	type = 'big',
	symbol = '$',
	isLoading = false,
	currentValue,
	minValue = 0,
	maxValue,
}) => {
	const { floatRef, lineRef, marginQuery, percent } = useProgressBar(isLoading, currentValue, maxValue)

	const progressValue = useMemo(
		() => <ProgressValue isLoading={isLoading} currentValue={currentValue} maxValue={maxValue} type={type} />,
		[isLoading, currentValue, maxValue, type],
	)

	const progressLine = useMemo(
		() => <ProgressLine isLoading={isLoading} width={width} percent={percent} lineRef={lineRef} />,
		[isLoading, width, percent],
	)

	const progressRange = useMemo(() => <ProgressRange minValue={minValue} maxValue={maxValue} />, [minValue, maxValue])

	const renderBigOrMedium = () => (
		<div className="gap-sm">
			{progressValue}
			{progressLine}
			{progressRange}
		</div>
	)

	const renderFloat = () => (
		<div className="gap-sm">
			{isLoading ? (
				<SkeletonLoader width={64} height={34} />
			) : (
				<div className={classNames.currentValueWrapper}>
					<div className={classNames.currentValue} ref={floatRef} style={{ marginLeft: marginQuery }}>
						<Tag size="md" variant="branded">
							{toLocaleNumber(currentValue)}
							{symbol}
						</Tag>
					</div>
				</div>
			)}
			{progressLine}
			{progressRange}
		</div>
	)

	return type === 'big' || type === 'medium' ? renderBigOrMedium() : renderFloat()
}
