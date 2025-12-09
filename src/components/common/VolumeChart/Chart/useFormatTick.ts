import { useCallback } from 'react'
import { VolumeRange } from '../types'
import { useIsMobile } from '@/hooks'

const fmtDayMonth = (d: Date) => {
	const day = d.getDate()
	const month = d.toLocaleDateString('en-US', { month: 'short' })
	return `${day} ${month}`
}

const format1M = (d: Date, index: number, dataLength: number) => {
	const isEdge = index === 0 || index === dataLength - 1
	if (isEdge) return fmtDayMonth(d)
	if (index % 7 === 0) return fmtDayMonth(d)
	return ''
}

const format3M = (d: Date, index: number, dataLength: number) => {
	const isEdge = index === 0 || index === dataLength - 1
	const day = d.getDate()
	if (isEdge) return fmtDayMonth(d)
	if (day === 1) return fmtDayMonth(d)
	return ''
}

const formatAll = (d: Date, index: number, dataLength: number, isMobile: boolean) => {
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

export const useFormatTick = (range: VolumeRange, dataLength: number) => {
	const isMobile = useIsMobile()

	const formatTick = useCallback(
		(value: string, index: number) => {
			const d = new Date(String(value))
			if (Number.isNaN(d.getTime())) return String(value)

			switch (range) {
				case VolumeRange.ONE_MONTH:
					return format1M(d, index, dataLength)
				case VolumeRange.THREE_MONTHS:
					return format3M(d, index, dataLength)
				case VolumeRange.ALL:
					return formatAll(d, index, dataLength, isMobile)
				default:
					return fmtDayMonth(d)
			}
		},
		[range, dataLength, isMobile],
	)

	return { formatTick }
}
