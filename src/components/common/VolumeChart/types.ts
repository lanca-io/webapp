export enum VolumeRange {
	ONE_MONTH = '1M',
	THREE_MONTHS = '3M',
	ALL = 'ALL',
}

export type ChartDataPoint = {
	time: string
	value: number
}

export type ChartData = ChartDataPoint[]
