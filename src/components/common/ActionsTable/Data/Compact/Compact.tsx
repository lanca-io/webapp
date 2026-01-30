import type { FC } from 'react'
import { PoolsActionType } from '@/components/common/PoolActionModal/Reducer/types'
import { PoolActionStatus } from '@/store/pools-positions/types'
import './Compact.pcss'
import { Tag } from '@concero/ui-kit'
import { InfoTip } from '@/components/common/InfoTip'

type CompactProps = {
	type: PoolsActionType
	status: PoolActionStatus
	completedAt: number | null
}

export const Compact: FC<CompactProps> = ({ type, status, completedAt }) => {
	const isDeposit = type === PoolsActionType.Deposit
	const isQueued = status === PoolActionStatus.Queued
	const text = isDeposit ? 'Deposit' : 'Withdrawal'

	const [timeText, isCompleted] = completedAt
		? (() => {
				const date = new Date(Number(BigInt(completedAt) * 1000n))
				const fmt = (n: number) => n.toString().padStart(2, '0')
				const timeStr = `${fmt(date.getUTCDate())} ${date.toLocaleDateString('en-GB', { month: 'short' })} ${date.getUTCFullYear()}, ${fmt(date.getUTCHours())}:${fmt(date.getUTCMinutes())}:${fmt(date.getUTCSeconds())}`
				return [timeStr, true] as const
			})()
		: ['15min', false]

	return (
		<div className="actions_table_compact">
			<div className="actions_table_compact_container">
				<div className="actions_table_compact_action">
					<span className="actions_table_compact_text">{text}</span>
					{isQueued && <Tag size="s">Queued</Tag>}
					{isQueued && (
						<InfoTip
							id="queued-action"
							description="Queued action will update once batch processing begins"
						/>
					)}
				</div>
				<div className="actions_table_compact_time">
					{isCompleted ? (
						<span className="actions_table_fees_time_value">{timeText}</span>
					) : (
						<>
							<span className="actions_table_fees_eta">ETA:</span>
							<span className="actions_table_fees_time_value">{timeText}</span>
						</>
					)}
				</div>
			</div>
			<div className="actions_table_compact_container">
				<div className="actions_table_compact_action" />
				<div className="actions_table_compact_action" />
			</div>
		</div>
	)
}
