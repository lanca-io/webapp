import { useEffect, useRef, useState, useMemo } from 'react'

export const useProgressBar = (isLoading: boolean, currentValue: number, maxValue: number) => {
	const floatRef = useRef<HTMLDivElement | null>(null)
	const lineRef = useRef<HTMLDivElement | null>(null)
	const [floatValueWidth, setFloatValueWidth] = useState(0)
	const [progressLineWidth, setProgressLineWidth] = useState(0)

	const floatValueMargin = useMemo(() => (floatValueWidth === 0 ? 0 : floatValueWidth / 2), [floatValueWidth])

	useEffect(() => {
		if (floatRef.current) {
			const { width: elWidth } = floatRef.current.getBoundingClientRect()
			setFloatValueWidth(elWidth)
		}

		if (lineRef.current) {
			const { width: elWidth } = lineRef.current.getBoundingClientRect()
			setProgressLineWidth(elWidth)
		}
	}, [isLoading, currentValue])

	const percent = useMemo(() => (currentValue / maxValue) * 100, [currentValue, maxValue])

	const marginQuery = useMemo(() => {
		if (percent === 0) return 0
		return `clamp(0px, calc(${percent}% - ${floatValueMargin}px), calc(${progressLineWidth}px - ${floatValueWidth}px))`
	}, [percent, floatValueMargin, progressLineWidth, floatValueWidth])

	return {
		floatRef,
		lineRef,
		marginQuery,
		percent,
	}
}
