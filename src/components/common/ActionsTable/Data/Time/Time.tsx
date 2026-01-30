import type { FC } from 'react'
import { formatTimestamp } from '@/utils/time'
import './Time.pcss'

type TimeProps = {
	completedAt?: number | null
}

export const Time: FC<TimeProps> = ({ completedAt }) => {
	const timeText = formatTimestamp(completedAt ?? null)
	const isCompleted = !!(completedAt && completedAt > 0)

	return (
		<div className="actions_table_time">
			{!isCompleted ? (
				<>
					<span className="actions_table_fees_eta">ETA:</span>
					<span className="actions_table_fees_time_value">{timeText}</span>
				</>
			) : (
				<span className="actions_table_fees_time_value">{timeText}</span>
			)}
		</div>
	)
}
