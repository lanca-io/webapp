export interface TimerCallbacks {
	stopTimer: () => void
	pauseTimer: () => void
	playTimer: () => void
	getTime: () => number
}

export const setTimer = (func?: (num: number) => void) => {
	let counterTime = 1
	let isPaused = false

	const timerId = setInterval(() => {
		if (!isPaused) {
			counterTime++
		}

		if (func) {
			func(counterTime)
		}
	}, 1000)

	return {
		stopTimer: () => {
			clearInterval(timerId)
		},
		pauseTimer: () => {
			isPaused = true
		},
		playTimer: () => {
			isPaused = true
		},
		getTime: () => counterTime,
	}
}
