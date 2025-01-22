import { type ParentPoolEventType } from '../../Pool/handlers/handleLastWithdrawalRequest'
import classNames from './UserActions.module.pcss'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { UserAction } from './Action/Action'
import { Modal } from '../../../../modals/Modal/Modal'
import { Button } from '../../../../layout/buttons/Button/Button'
import { useMediaQuery } from '../../../../../hooks/useMediaQuery'
import { IconButton } from '../../../../layout/buttons/IconButton/IconButton'
import { CrossIcon } from '../../../../../assets/icons/CrossIcon'
import { useGetUserActions } from '../../../hooks/useGetUserActions'
import { getRemainingTime } from './timeCalculation'

export enum UserActionStatus {
	ActiveRequestWithdraw = 'ActiveRequestWithdraw',
	WithdrawRetryNeeded = 'WithdrawRetryNeeded',
}

export interface UserTransaction {
	eventName?: string
	eventType?: ParentPoolEventType
	time: number
	amount: string
	status: string | null
	transactionHash: string
	address: string
	isActiveWithdraw?: boolean
	deadline?: number | null
	args: any
}

export function UserActions() {
	const { address } = useAccount()
	const [isOpen, setIsOpen] = useState(false)
	const [retryTimeLeft, setRetryTimeLeft] = useState<number>(0)
	const isMobile = useMediaQuery('ipad')

	const { actions, isLoading, error } = useGetUserActions(address, retryTimeLeft)

	useEffect(() => {
		const retryPerformedTimestamp = localStorage.getItem('retryPerformedTimestamp')
		if (!retryPerformedTimestamp) return

		setRetryTimeLeft(getRemainingTime(retryPerformedTimestamp))

		const intervalId = setInterval(() => {
			setRetryTimeLeft(getRemainingTime(retryPerformedTimestamp))
		}, 60 * 1000)

		return () => {
			clearInterval(intervalId)
		}
	}, [])

	return (
		<>
			<Button
				isLoading={isLoading}
				isDisabled={(!isLoading && actions.length === 0) || !address}
				onClick={() => {
					setIsOpen(!isOpen)
				}}
				size="lg"
				variant="secondary"
				className={classNames.actionButton}
			>
				{isMobile ? '' : 'Actions'} History
			</Button>
			<Modal
				position="top"
				setShow={() => {
					setIsOpen(!isOpen)
				}}
				show={isOpen}
				isHeaderVisible={false}
				className={classNames.actionsModal}
			>
				<div className="row ac jsb">
					<h3 className={classNames.title}>Actions history</h3>
					<IconButton
						onClick={() => {
							setIsOpen(false)
						}}
						size="md"
						variant="secondary"
					>
						<CrossIcon />
					</IconButton>
				</div>

				<div className={`${classNames.action} ${classNames.header}`}>
					<div className={classNames.leftSide}>
						<h6>Action</h6>
					</div>
					<h6 className={classNames.value}>Amount</h6>
					<div className={classNames.date}>
						<h6>Date</h6>
					</div>
					<div className={classNames.button}></div>
				</div>

				<div className={classNames.list}>
					{actions.map(action => (
						<UserAction
							setRetryTimeLeft={setRetryTimeLeft}
							retryTimeLeft={retryTimeLeft}
							key={action.transactionHash}
							action={action}
						/>
					))}
				</div>
				{error && <p className={classNames.error}>{error}</p>}
			</Modal>
		</>
	)
}
