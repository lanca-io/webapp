import { useState, useEffect, useCallback, useMemo } from 'react'
import { groupDataByWeeks } from '../../../utils/charts'
import { toLocaleNumber } from '../../../utils/formatting'
import { type Fee } from './useGetFees'
import { type ChartData } from '../../layout/Charts/Chart/Chart'

export const usePoolMetrics = (fees: Fee[], poolLiquidity: number, initialLoading: boolean) => {
	const [apy, setApy] = useState<string>('0')
	const [totalRewards, setTotalRewards] = useState<string>('0')
	const [isLoading, setIsLoading] = useState<boolean>(initialLoading)

	const handleAPY = useCallback(() => {
		setIsLoading(true)
		let rewards = 0

		const feeData: ChartData[] = fees.map(fee => {
			rewards += fee.feeMade
			return {
				time: fee.timestamp * 1000,
				value: fee.feeMade,
			}
		})

		const groupedWeeklyFees = groupDataByWeeks(feeData)

		if (groupedWeeklyFees.length < 2) {
			console.warn('Not enough data to calculate APY')
			setIsLoading(false)
			return
		}

		const previousWeekFees = groupedWeeklyFees[groupedWeeklyFees.length - 2].value
		const calculatedApy = ((previousWeekFees * 52) / poolLiquidity) * 100

		setApy(toLocaleNumber(calculatedApy).toString())
		setTotalRewards(toLocaleNumber(rewards).toString())
		setIsLoading(false)
	}, [fees, poolLiquidity])

	useEffect(() => {
		if (fees.length && poolLiquidity > 0) {
			handleAPY()
		} else {
			setIsLoading(true)
		}
	}, [fees, poolLiquidity, handleAPY])

	const memoizedMetrics = useMemo(() => ({ apy, totalRewards, isLoading }), [apy, totalRewards, isLoading])

	return memoizedMetrics
}
