import { useState, useEffect, useCallback } from 'react'
import { type Fee } from './useGetFees'
import { type ChartData } from '../../layout/Charts/Chart/Chart'

export interface TimeFilter {
	title: string
	value: string
	startTime: number | null | undefined
	endTime: number | null | undefined
}

export const useGetTotalVolume = (fees: Fee[], activeFilter: TimeFilter) => {
	const [volumeData, setVolumeData] = useState<ChartData[]>([])
	const [totalVolume, setTotalVolume] = useState<number>(0)

	const calculateTotalVolume = useCallback(() => {
		let totalValue = 0
		const chartData = fees.reduce<ChartData[]>((acc: any, fee) => {
			const feeTime = fee.timestamp
			const { startTime, endTime } = activeFilter

			if ((!startTime || feeTime >= startTime) && (!endTime || feeTime <= endTime)) {
				const feeValue = {
					time: fee.timestamp * 1000,
					value: fee.loanGivenOut,
				}

				totalValue += feeValue.value

				return [...acc, feeValue]
			}
			return acc
		}, [])

		setTotalVolume(totalValue)
		setVolumeData(chartData)
	}, [fees, activeFilter])

	useEffect(() => {
		if (!fees) return

		calculateTotalVolume()
	}, [activeFilter, fees, calculateTotalVolume])

	return { volumeData, totalVolume }
}
