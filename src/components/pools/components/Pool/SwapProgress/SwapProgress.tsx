import { type Dispatch, type FC, useEffect, useState } from 'react'
import { TransactionStep } from './TransactionStep/TransactionStep'
import { type PoolAction, PoolActionType, PoolCardStage, type PoolState, StageType } from '../poolReducer/types'
import { Separator } from '../../../../layout/Separator/Separator'
import { Alert } from '../../../../layout/Alert/Alert'
import { Loader } from '../../../../layout/Loader/Loader'
import { TrailArrowRightIcon } from '../../../../../assets/icons/TrailArrowRightIcon'
import { InfoIcon } from '../../../../../assets/icons/InfoIcon'
import { PencilIcon } from '../../../../../assets/icons/PencilIcon'
import { CrossIcon } from '../../../../../assets/icons/CrossIcon'
import { FinishTxInfo } from './FinishTxInfo/FinishTxInfo'
import { ProgressDetails } from './ProgressDetails/ProgressDetails'
import { Button } from '../../../../layout/buttons/Button/Button'
import { IconButton } from '../../../../layout/buttons/IconButton/IconButton'
import { Tag } from '../../../../layout/Tag/Tag'
import { TimeIcon } from '../../../../../assets/icons/TimeIcon'
import { trackEvent } from '../../../../../hooks/useTracking'
import { action, category } from '../../../../../constants/tracking'

import classNames from './SwapProgress.module.pcss'

interface SwapProgressProps {
	poolState: PoolState
	handleGoBack: () => void
	poolDispatch: Dispatch<PoolAction>
}

const getTimerStatus = (time: number) => {
	if (time > 20) return 'neutral'
	if (time > 10) return 'warning'
	return 'negative'
}

const statusColorMap = {
	neutral: 'var(--color-grey-700)',
	warning: 'var(--color-warning-700)',
	negative: 'var(--color-danger-700)',
}

export const SwapProgress: FC<SwapProgressProps> = ({ poolState, poolDispatch, handleGoBack }) => {
	const [time, setTime] = useState(60)
	const { to, from, stage, steps, poolMode } = poolState

	const isFailed = stage === PoolCardStage.failed
	const isSuccess = stage === PoolCardStage.success
	const currentStep = steps[steps.length - 1]
	const isAwait = currentStep && currentStep.status === 'await'

	const isDeposit = poolMode === 'deposit'
	const isDepositRequested = steps[1] ? steps[1].type === StageType.requestTx && steps[1].status === 'success' : false
	const isDepositTxSigned = steps[2] ? steps[2].type === StageType.transactionSigned : false

	const cancelTransaction = () => {
		poolDispatch({ type: PoolActionType.SET_SWAP_STAGE, payload: PoolCardStage.failed })
		poolDispatch({
			type: PoolActionType.APPEND_SWAP_STEP,
			payload: {
				title: 'Deposit failed',
				body: 'Something went wrong',
				status: 'error',
				type: StageType.transaction,
			},
		})

		trackEvent({
			category: category.PoolCard,
			action: action.FailedDeposit,
			label: 'concero_failed_deposit_time_expired',
			data: { from, to },
		})
	}

	useEffect(() => {
		if (!isDepositRequested || isFailed || isDepositTxSigned) return

		const timerId = setInterval(() => {
			setTime(prevTime => {
				if (isDepositTxSigned) {
					clearInterval(timerId)
					return prevTime
				}

				if (prevTime <= 0) {
					cancelTransaction()
					clearInterval(timerId)
					return prevTime
				}

				return prevTime - 1
			})
		}, 1000)

		return () => {
			clearInterval(timerId)
		}
	}, [isDepositRequested, isFailed, isDepositTxSigned])

	const renderButtons: Record<string, JSX.Element> | Record<string, null> = {
		[PoolCardStage.failed]: (
			<div className="gap-lg w-full">
				<Separator />
				<Button
					isFull
					onClick={handleGoBack}
					variant="secondaryColor"
					size="md"
					className={classNames.actionButton}
				>
					Try again
				</Button>
			</div>
		),
		[PoolCardStage.success]: (
			<div className="gap-lg w-full">
				<Separator />
				<Button
					isFull
					onClick={handleGoBack}
					variant="secondaryColor"
					size="md"
					className={classNames.actionButton}
				>
					Done
				</Button>
			</div>
		),
	}

	const title: Record<string, string> | Record<string, null> = {
		[PoolCardStage.progress]:
			currentStep?.type === StageType.transaction || currentStep?.type === StageType.requestTx
				? `${isDeposit ? 'Deposit' : 'Withdrawal'}...`
				: `Preparing ${isDeposit ? 'deposit' : 'withdrawal'}...`,
		[PoolCardStage.failed]: `${isDeposit ? 'Deposit' : 'Withdrawal'} failed`,
		[PoolCardStage.success]: `${isDeposit ? 'Deposit' : 'Withdrawal'} successful!`,
	}

	const transactionStatus = steps
		.slice()
		.reverse()
		.find(step => step.type === StageType.transaction)?.status

	const approvalStatus = steps
		.slice()
		.reverse()
		.find(step => step.type === StageType.approve)?.status

	const requestTxStatus = steps
		.slice()
		.reverse()
		.find(step => step.type === StageType.requestTx)?.status

	const progressDetails = (
		<>
			<ProgressDetails from={from} to={to} stage={stage} steps={steps} />

			<div className={classNames.progressContainer}>
				<TransactionStep status={approvalStatus ?? 'idle'} title="Approvals" />
				<TrailArrowRightIcon />
				{isDeposit && (
					<>
						<TransactionStep status={requestTxStatus ?? 'idle'} title="Request" />
						<TrailArrowRightIcon />
					</>
				)}
				<TransactionStep status={transactionStatus ?? 'idle'} title={isDeposit ? 'Deposit' : 'Withdrawal'} />
			</div>

			{isDepositRequested && time > 0 && !isDepositTxSigned && !isFailed && (
				<Tag
					variant={getTimerStatus(time)}
					size="md"
					leftIcon={<TimeIcon color={statusColorMap[getTimerStatus(time)]} />}
				>
					{time}s
				</Tag>
			)}

			{isAwait && (
				<div className={classNames.infoMessage}>
					<div className={classNames.wrapIcon}>
						<PencilIcon />
					</div>
					<h4 className={classNames.messageTitle}>Signature required</h4>
					<p className={classNames.messageSubtitle}>Please open your wallet and sign the transaction</p>
				</div>
			)}

			{currentStep && !isAwait && (
				<Alert
					title={currentStep.title}
					variant={isFailed ? 'error' : 'neutral'}
					icon={isFailed ? <InfoIcon color="var(--color-danger-700)" /> : <Loader variant="neutral" />}
				/>
			)}
		</>
	)

	return (
		<div className={classNames.container}>
			<div className={classNames.header}>
				<h3>{title[stage] ?? ''}</h3>
				{(isSuccess || isFailed) && (
					<IconButton onClick={handleGoBack} className={classNames.closeButton} variant="secondary" size="md">
						<CrossIcon />
					</IconButton>
				)}
			</div>

			{isSuccess ? <FinishTxInfo isDeposit={isDeposit} to={to} /> : progressDetails}

			{renderButtons[stage] ?? null}
		</div>
	)
}
