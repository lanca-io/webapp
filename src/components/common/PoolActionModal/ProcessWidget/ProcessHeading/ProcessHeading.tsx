import type { FC } from 'react'
import { memo, useMemo } from 'react'
import { IconButton } from '@concero/ui-kit'
import { usePoolsActionContext } from '../../Reducer/Provider'
import {
	PoolsActionStages,
	PoolsActionStatus,
	PoolsActionType,
} from '../../Reducer/types'
import { CloseIcon } from '@/assets/CloseIcon'
import './ProcessHeading.pcss'

type HeadingMap = {
	[PoolsActionStatus.Idle]: string
	[PoolsActionStatus.Pending]: Record<PoolsActionStages, string>
	[PoolsActionStatus.Success]: Record<PoolsActionStages, string>
	[PoolsActionStatus.Failed]: Record<PoolsActionStages, string>
	[PoolsActionStatus.Rejected]: Record<PoolsActionStages, string>
}

type ProcessHeadingProps = {
	onClose: () => void
}

export const ProcessHeading: FC<ProcessHeadingProps> = memo(({ onClose }) => {
	const { state } = usePoolsActionContext()

	const currentStage =
		state.queue !== PoolsActionStatus.Idle
			? PoolsActionStages.Queue
			: PoolsActionStages.Allowance
	const currentStatus =
		currentStage === PoolsActionStages.Allowance ? state.allowance : state.queue

	const isFinalStage =
		state.allowance === PoolsActionStatus.Failed ||
		state.allowance === PoolsActionStatus.Rejected ||
		state.queue === PoolsActionStatus.Failed ||
		state.queue === PoolsActionStatus.Rejected ||
		state.queue === PoolsActionStatus.Success

	const headingMap: HeadingMap = useMemo(
		() => ({
			[PoolsActionStatus.Idle]: 'Initializing...',
			[PoolsActionStatus.Pending]: {
				[PoolsActionStages.Allowance]:
					state.type === PoolsActionType.Deposit
						? 'Preparing Deposit...'
						: 'Preparing Withdrawal...',
				[PoolsActionStages.Queue]:
					state.type === PoolsActionType.Deposit
						? 'Deposit...'
						: 'Withdrawal...',
			},
			[PoolsActionStatus.Success]: {
				[PoolsActionStages.Allowance]: 'Success!',
				[PoolsActionStages.Queue]: 'Success!',
			},
			[PoolsActionStatus.Failed]: {
				[PoolsActionStages.Allowance]: 'Approval Failed',
				[PoolsActionStages.Queue]:
					state.type === PoolsActionType.Deposit
						? 'Deposit Failed'
						: 'Withdrawal Failed',
			},
			[PoolsActionStatus.Rejected]: {
				[PoolsActionStages.Allowance]: 'Approval Rejected',
				[PoolsActionStages.Queue]:
					state.type === PoolsActionType.Deposit
						? 'Deposit Rejected'
						: 'Withdrawal Rejected',
			},
		}),
		[state.type],
	)

	const heading =
		currentStatus === PoolsActionStatus.Idle
			? headingMap[currentStatus]
			: headingMap[currentStatus][currentStage]

	return (
		<div
			className={`pool_action_process_heading ${
				!isFinalStage ? 'pool_action_process_heading_no_button' : ''
			}`}
		>
			<h4 className="pool_action_process_card_title">{heading}</h4>
			{isFinalStage && (
				<IconButton
					variant="secondary"
					size="m"
					aria-label="Back to swap"
					onClick={onClose}
				>
					<CloseIcon />
				</IconButton>
			)}
		</div>
	)
})
