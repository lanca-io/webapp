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

const QUEUED_DESCRIPTION =
	'Your action is queued and will update to the next status once batch processing begins' as const

export const Action: FC<ActionProps> = ({ type, status }) => {
	const showTag: boolean = type === PoolsActionType.Deposit
	const actionText: string = showTag ? 'Deposit' : 'Withdrawal'
	const showQueued: boolean = status === PoolActionStatus.Queued

	const tooltipProps = {
		id: 'queued-action' as const,
		description: QUEUED_DESCRIPTION,
	}

	return (
		<div className="actions_table_action">
			<div className="actions_table_action_description">
				<span className="actions_table_action_type">{actionText}</span>
				{showQueued && <Tag size="s">Queued</Tag>}
			</div>
			{showQueued && <InfoTip {...tooltipProps} />}
		</div>
	)
}
