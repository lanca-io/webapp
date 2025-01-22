import { config } from '../../../../../constants/config'
import dayjs from 'dayjs'

export const getWithdrawalDate = (timestampInMillis: number) => {
	if (!timestampInMillis) return

	const timestampInSeconds = Math.floor(timestampInMillis / 1000)
	const additionalTimeInSeconds = 597600 + (config.IS_TESTNET ? 0 : 3600)
	const withdrawalDeadlineInSeconds = timestampInSeconds + additionalTimeInSeconds

	const withdrawalDeadline = dayjs.unix(withdrawalDeadlineInSeconds)
	const currentTime = dayjs()

	let timeUnit = 'days'
	let timeLeft = withdrawalDeadline.diff(currentTime, 'days')

	if (timeLeft === 0) {
		timeUnit = 'hours'
		timeLeft = withdrawalDeadline.diff(currentTime, 'hours')
	}

	if (timeLeft === 0) {
		timeUnit = 'minutes'
		timeLeft = withdrawalDeadline.diff(currentTime, 'minutes')
	}

	return `Locked, ${timeLeft} ${timeUnit} left`
}

export const getRemainingTime = (time: string | number): number => {
	const endTime = new Date(Number(time) + 30 * 60 * 1000)

	const currentTime = new Date()
	const timeDifferenceInSeconds = Math.max(0, Math.floor((endTime.getTime() - currentTime.getTime()) / 1000))
	return timeDifferenceInSeconds < 0 ? 0 : timeDifferenceInSeconds
}
