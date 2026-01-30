import type { FC } from 'react'
import { formatTimestamp } from '@/utils/time'
import './Time.pcss'

type UnixTimestamp = number

type TimeProps = {
	completedAt?: UnixTimestamp | null
}

export const Time: FC<TimeProps> = ({ completedAt }) => {
	const formatted = formatTimestamp(completedAt ?? null)
	const isPending = !completedAt || completedAt <= 0

	return (
		<div className="actions_table_time">
			{isPending ? (
				<>
					<span className="actions_table_fees_eta">ETA:</span>
					<span className="actions_table_fees_time_value">{formatted}</span>
				</>
			) : (
				<span className="actions_table_fees_time_value">{formatted}</span>
			)}
		</div>
	)
}
