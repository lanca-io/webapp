import type { FC } from 'react'
import { PoolsActionType } from '@/components/common/PoolActionModal/Reducer/types'
import { PoolActionStatus } from '@/store/pools-positions/types'
import { InfoTip } from '@/components/common/InfoTip'
import { Tag } from '@concero/ui-kit'
import './Action.pcss'

type ActionProps = {
	type: PoolsActionType
	status: PoolActionStatus
}

export const Action: FC<ActionProps> = ({ type, status }) => {
	const isDeposit = type === PoolsActionType.Deposit
	const actionText = isDeposit ? 'Deposit' : 'Withdrawal'
	const isQueued = status === PoolActionStatus.Queued

	return (
		<div className="actions_table_action">
			<div className="actions_table_action_description">
				<span className="actions_table_action_type">{actionText}</span>
				{isQueued && <Tag size="s">Queued</Tag>}
			</div>
			{isQueued && (
				<InfoTip
					id="queued-action"
					description="Your action is queued and will update to the next status once batch processing begins"
				/>
			)}
		</div>
	)
}
