import React from 'react'
import classNames from './ProgressValue.module.pcss'
import { toLocaleNumber } from '../../../../../../../utils/formatting'
import { SkeletonLoader } from '../../../../../../layout/SkeletonLoader/SkeletonLoader'

interface ProgressValueProps {
	isLoading: boolean
	currentValue: number
	maxValue: number
	type: 'big' | 'medium' | 'float'
}

export const ProgressValue: React.FC<ProgressValueProps> = ({ isLoading, currentValue, maxValue, type }) => {
	const valueClass = type === 'big' ? classNames.currentValueBig : classNames.currentValueMedium
	const maxValueClass = type === 'big' ? classNames.maxValueBig : classNames.maxValueMedium

	return isLoading ? (
		<SkeletonLoader width={type === 'big' ? 128 : 64} height={type === 'big' ? 27.5 : 20} />
	) : (
		<h3 className={valueClass}>
			{toLocaleNumber(currentValue)} <span className={maxValueClass}>/{toLocaleNumber(maxValue)}</span>
		</h3>
	)
}
