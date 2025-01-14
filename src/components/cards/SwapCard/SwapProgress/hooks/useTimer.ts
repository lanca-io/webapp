import { useState, useEffect } from 'react'

export const useTimer = (isApprovalStage: boolean, isSuccess: boolean, isFailed: boolean) => {
	const [time, setTime] = useState<number>(0)

	useEffect(() => {
		const timerId = setInterval(() => {
			if (isApprovalStage || isSuccess || isFailed) return

			setTime(prev => prev + 1)
		}, 1000)

		if (isSuccess || isApprovalStage || isFailed) {
			clearInterval(timerId)
		}

		return () => {
			clearInterval(timerId)
		}
	}, [isApprovalStage, isSuccess, isFailed])

	return time
}
