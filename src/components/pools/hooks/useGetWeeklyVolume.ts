import { useState, useEffect, useCallback } from 'react'
import { type Fee } from './useGetFees'
import { type ChartData } from '../../layout/Charts/Chart/Chart'
import { groupDataByWeeks } from '../../../utils/charts'
import { toLocaleNumber } from '../../../utils/formatting'

export interface TimeFilter {
	title: string
	value: string
	startTime: number | null | undefined
	endTime: number | null | undefined
}

const filterFeesByTime = (fees: Fee[], activeFilter: TimeFilter): ChartData[] => {
	return fees.reduce<ChartData[]>((acc, fee) => {
		const feeTime = fee.timestamp
		const { startTime, endTime } = activeFilter

		if ((!startTime || feeTime >= startTime) && (!endTime || feeTime <= endTime)) {
			const feeValue = {
				time: fee.timestamp * 1000,
				value: fee.feeMade,
			}
			return [...acc, feeValue]
		}
		return acc
	}, [])
}

const calculateTotalValue = (chartData: ChartData[]): number => {
	return chartData.reduce((total, data) => total + data.value, 0)
}

export const useGetWeeklyVolume = (fees: Fee[], activeFilter: TimeFilter) => {
	const [groupedVolumeData, setGroupedVolumeData] = useState<ChartData[]>([])
	const [totalVolumeFormatted, setTotalVolumeFormatted] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(true)

	const calculateWeeklyVolume = useCallback(() => {
		setIsLoading(true)
		if (!Array.isArray(fees)) {
			console.error('Invalid fees data provided')
			setIsLoading(false)
			return
		}

		try {
			const chartData = filterFeesByTime(fees, activeFilter)
			const totalValue = calculateTotalValue(chartData)

			setGroupedVolumeData(groupDataByWeeks(chartData))
			setTotalVolumeFormatted('$' + toLocaleNumber(totalValue))
		} catch (error) {
			console.error('Error processing fee data:', error)
			setGroupedVolumeData([])
			setTotalVolumeFormatted('$0')
		} finally {
			setIsLoading(false)
		}
	}, [fees, activeFilter])

	useEffect(() => {
		if (!fees) return

		calculateWeeklyVolume()
	}, [activeFilter, fees, calculateWeeklyVolume])

	return { groupedVolumeData, totalVolumeFormatted, isLoading }
}
