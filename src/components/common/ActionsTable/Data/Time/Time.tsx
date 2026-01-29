import type { FC } from 'react'
import './Time.pcss'

type TimeProps = {
	completedAt?: number | null
}

export const Time: FC<TimeProps> = ({ completedAt }) => {
	if (!completedAt) {
		return (
			<div className="actions_table_time">
				<span className="actions_table_fees_eta">ETA:</span>
				<span className="actions_table_fees_time_value">15min</span>
			</div>
		)
	}

	const ts = BigInt(completedAt).valueOf()
	const date = new Date(Number(ts * 1000n))

	const day = date.getUTCDate().toString().padStart(2, '0')
	const monthAbbr = date.toLocaleDateString('en-GB', {
		month: 'short' as const,
	})
	const hours = date.getUTCHours().toString().padStart(2, '0')
	const minutes = date.getUTCMinutes().toString().padStart(2, '0')
	const seconds = date.getUTCSeconds().toString().padStart(2, '0')
	const year = date.getUTCFullYear()

	return (
		<div className="actions_table_time">
			<span className="actions_table_fees_time_value">
				{`${day} ${monthAbbr} ${year}, ${hours}:${minutes}:${seconds}`}
			</span>
		</div>
	)
}
