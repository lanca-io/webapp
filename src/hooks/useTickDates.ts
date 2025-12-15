import { useCallback } from 'react'
import { useIsMobile } from '@/hooks'
import { ChartRange } from '@/components/common/ChartMenu'

const fmtDayMonth = (d: Date) => {
	const day = d.getDate()
	const month = d.toLocaleDateString('en-US', { month: 'short' })
	return `${day} ${month}`
}

const format1M = (d: Date, index: number, dataLength: number) => {
	const isFirst = index === 0
	const isLast = index === dataLength - 1

	// Always show first and last date
	if (isFirst || isLast) {
		return fmtDayMonth(d)
	}

	// Show every 7th point counting from the first index
	const step = 7
	const offsetIndex = index - 0 // here first is 0, but keeping explicit
	const isAnchor = offsetIndex % step === 0

	if (isAnchor) {
		return fmtDayMonth(d)
	}

	return ''
}
const format3M = (d: Date, index: number, dataLength: number) => {
	const isEdge = index === 0 || index === dataLength - 1
	const day = d.getDate()
	if (isEdge) return fmtDayMonth(d)
	if (day === 1) return fmtDayMonth(d)
	return ''
}

const formatAll = (
	d: Date,
	index: number,
	dataLength: number,
	isMobile: boolean,
) => {
	const isEdge = index === 0 || index === dataLength - 1

	if (isEdge) {
		const month = d.toLocaleDateString('en-US', { month: 'short' })
		const yearShort = d.getFullYear().toString().slice(-2)
		return `${month} ${yearShort}`
	}

	if (isMobile) {
		const step = 4
		const isAnchor = index % step === 0
		if (!isAnchor) return ''
		return d.toLocaleDateString('en-US', { month: 'short' })
	}

	const step = Math.max(1, Math.floor(dataLength / 8))
	const isAnchor = index % step === 0
	if (!isAnchor) return ''
	return d.toLocaleDateString('en-US', { month: 'short' })
}

export const useTickDates = (range: ChartRange, dataLength: number) => {
	const isMobile = useIsMobile()

	const formatTick = useCallback(
		(value: string, index: number) => {
			const d = new Date(String(value))
			if (Number.isNaN(d.getTime())) return String(value)

			switch (range) {
				case ChartRange.ONE_MONTH:
					return format1M(d, index, dataLength)
				case ChartRange.THREE_MONTHS:
					return format3M(d, index, dataLength)
				case ChartRange.ALL:
					return formatAll(d, index, dataLength, isMobile)
				default:
					return fmtDayMonth(d)
			}
		},
		[range, dataLength, isMobile],
	)

	return { formatTick }
}
