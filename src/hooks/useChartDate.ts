import { useMemo } from 'react'
import { format } from 'date-fns'
import { ChartRange } from '@/components/common/ChartMenu'

type TickFormatter = (value: string | number) => string

type UseChartDateResult = {
	formatDate: TickFormatter
	interval: number
	ticks?: (string | number)[]
}

type Point = { time: string; value: number }
type Data = Point[]

const create1Month = (data: Data): string[] => {
	if (!data.length) return []
	const firstTime = data[0]!.time
	const lastTime = data[data.length - 1]!.time

	const ticks: string[] = []
	const firstDate = new Date(firstTime)
	const lastDate = new Date(lastTime)

	let cursor = new Date(firstDate)
	cursor.setHours(0, 0, 0, 0)

	while (cursor <= lastDate) {
		const iso = cursor.toISOString().slice(0, 10)
		if (data.some(d => d.time.startsWith(iso))) {
			ticks.push(iso)
		}
		cursor.setDate(cursor.getDate() + 7)
	}

	ticks.unshift(firstTime)
	ticks.push(lastTime)

	let unique = Array.from(new Set(ticks)).sort((a, b) =>
		a < b ? -1 : a > b ? 1 : 0,
	)

	if (unique.length >= 2) {
		const secondLastDate = new Date(unique[unique.length - 2]!)
		const lastDateTick = new Date(unique[unique.length - 1]!)
		const diffDays =
			(lastDateTick.getTime() - secondLastDate.getTime()) /
			(1000 * 60 * 60 * 24)

		if (diffDays < 3) {
			unique = [...unique.slice(0, -2), unique[unique.length - 1]!]
		}
	}

	return unique
}

const create3Month = (data: Data): string[] => {
	if (!data.length) return []
	const times = data.map(d => d.time)

	return times.filter((t, idx) => {
		const date = new Date(t)
		const day = date.getDate()
		if (day !== 1 && day !== 15) return false
		const prev = idx > 0 ? new Date(times[idx - 1]!) : null
		return !prev || prev.getMonth() !== date.getMonth() || prev.getDate() < day
	})
}

const createAll = (data: Data): string[] => {
	if (!data.length) return []
	const times = data.map(d => d.time)

	const firstOfEachMonth: string[] = []
	const seenMonths = new Set<string>()

	for (const t of times) {
		const date = new Date(t)
		const key = `${date.getFullYear()}-${date.getMonth()}`
		if (seenMonths.has(key)) continue
		seenMonths.add(key)
		firstOfEachMonth.push(t)
	}

	const first = new Date(firstOfEachMonth[0]!)
	const firstIndex = first.getFullYear() * 12 + first.getMonth()

	return firstOfEachMonth.filter(t => {
		const d = new Date(t)
		const idx = d.getFullYear() * 12 + d.getMonth()
		return (idx - firstIndex) % 6 === 0
	})
}

export const useChartDate = (
	range: ChartRange,
	data: Data,
): UseChartDateResult => {
	return useMemo<UseChartDateResult>(() => {
		switch (range) {
			case ChartRange.ONE_MONTH: {
				const ticks = create1Month(data)
				return {
					formatDate: value => format(new Date(value), 'd MMM'),
					interval: 0,
					ticks,
				}
			}

			case ChartRange.THREE_MONTHS: {
				const ticks = create3Month(data)
				return {
					formatDate: value => format(new Date(value), 'd MMM'),
					interval: 0,
					ticks,
				}
			}

			case ChartRange.ALL:
			default: {
				const ticks = createAll(data)
				return {
					formatDate: value => {
						const date = new Date(value)
						const month = date.getMonth()
						return month === 0 ? format(date, 'MMM yy') : format(date, 'MMM')
					},
					interval: 0,
					ticks,
				}
			}
		}
	}, [range, data])
}
