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
	[PoolsActionStatus.IDLE]: string
	[PoolsActionStatus.PENDING]: Record<PoolsActionStages, string>
	[PoolsActionStatus.SUCCESS]: Record<PoolsActionStages, string>
	[PoolsActionStatus.FAILED]: Record<PoolsActionStages, string>
	[PoolsActionStatus.REJECTED]: Record<PoolsActionStages, string>
}

export const ProcessHeading: FC = memo(() => {
	const { state } = usePoolsActionContext()

	const currentStage =
		state.queue !== PoolsActionStatus.IDLE
			? PoolsActionStages.QUEUE
			: PoolsActionStages.ALLOWANCE
	const currentStatus =
		currentStage === PoolsActionStages.ALLOWANCE ? state.allowance : state.queue

	const isFinalStage =
		state.allowance === PoolsActionStatus.FAILED ||
		state.allowance === PoolsActionStatus.REJECTED ||
		state.queue === PoolsActionStatus.FAILED ||
		state.queue === PoolsActionStatus.REJECTED ||
		state.queue === PoolsActionStatus.SUCCESS

	const headingMap: HeadingMap = useMemo(
		() => ({
			[PoolsActionStatus.IDLE]: 'Initializing...',
			[PoolsActionStatus.PENDING]: {
				[PoolsActionStages.ALLOWANCE]:
					state.type === PoolsActionType.DEPOSIT
						? 'Preparing Deposit...'
						: 'Preparing Withdrawal...',
				[PoolsActionStages.QUEUE]:
					state.type === PoolsActionType.DEPOSIT
						? 'Deposit...'
						: 'Withdrawal...',
			},
			[PoolsActionStatus.SUCCESS]: {
				[PoolsActionStages.ALLOWANCE]: 'Success!',
				[PoolsActionStages.QUEUE]: 'Success!',
			},
			[PoolsActionStatus.FAILED]: {
				[PoolsActionStages.ALLOWANCE]: 'Approval Failed',
				[PoolsActionStages.QUEUE]:
					state.type === PoolsActionType.DEPOSIT
						? 'Deposit Failed'
						: 'Withdrawal Failed',
			},
			[PoolsActionStatus.REJECTED]: {
				[PoolsActionStages.ALLOWANCE]: 'Approval Rejected',
				[PoolsActionStages.QUEUE]:
					state.type === PoolsActionType.DEPOSIT
						? 'Deposit Rejected'
						: 'Withdrawal Rejected',
			},
		}),
		[],
	)

	const heading =
		currentStatus === PoolsActionStatus.IDLE
			? headingMap[currentStatus]
			: headingMap[currentStatus][currentStage]

	return (
		<div
			className={`pool_action_process_heading ${!isFinalStage ? 'pool_action_process_heading_no_button' : ''}`}
		>
			<h4 className="pool_action_process_card_title">{heading}</h4>
			{isFinalStage && (
				<IconButton variant="secondary" size="m" aria-label="Back to swap">
					<CloseIcon />
				</IconButton>
			)}
		</div>
	)
})
