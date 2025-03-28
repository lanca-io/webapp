import { type FC, type Dispatch } from 'react'
import classNames from './SwapProgress.module.pcss'
import { TransactionStep } from '../../../layout/TransactionStep/TransactionStep'
import { StageType, SwapCardStage, type SwapState, type SwapAction } from '../swapReducer/types'
import { Button } from '../../../layout/buttons/Button/Button'
import { PendingStateSvg } from '../../../../assets/images/transactionStates/PendingStateSvg'
import { Separator } from '../../../layout/Separator/Separator'
import { Alert } from '../../../layout/Alert/Alert'
import { Loader } from '../../../layout/Loader/Loader'
import { TrailArrowRightIcon } from '../../../../assets/icons/TrailArrowRightIcon'
import { FailStateSvg } from '../../../../assets/images/transactionStates/FailStateSvg'
import { SuccessStateSvg } from '../../../../assets/images/transactionStates/SuccessStateSvg'
import { InfoIcon } from '../../../../assets/icons/InfoIcon'
import { IconButton } from '../../../layout/buttons/IconButton/IconButton'
import { TrailArrowLeftIcon } from '../../../../assets/icons/TrailArrowLeftIcon'
import { PencilIcon } from '../../../../assets/icons/PencilIcon'
import { CrossIcon } from '../../../../assets/icons/CrossIcon'
import { FinishTxInfo } from './FinishTxInfo/FinishTxInfo'
import { SwapProgressDetails } from './SwapProgressDetails/SwapProgressDetails'
import { arbitrum, avalanche, base, polygon } from 'wagmi/chains'
import { zeroAddress } from 'viem'
import { Status, StepType } from '@lanca/sdk'
import { useTimer } from './hooks/useTimer'
import { useTransactionCompletion } from './hooks/useTransactionCompletion'
import { useSwapStatuses } from './hooks/useSwapStatuses'

interface SwapProgressProps {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
	handleGoBack: () => void
}

const chainsTwitterMap: Record<string, string> = {
	[arbitrum.id]: 'arbitrum',
	[base.id]: 'base',
	[polygon.id]: '0xPolygon',
	[avalanche.id]: 'avax',
}

export const SwapProgress: FC<SwapProgressProps> = ({ swapState, swapDispatch, handleGoBack }) => {
	const { to, from, steps, selectedRoute, stage } = swapState

	const isBridge = from.chain.id !== to.chain.id
	const isFailed = stage === SwapCardStage.failed
	const isSuccess = stage === SwapCardStage.success
	const isWarning = stage === SwapCardStage.warning

	const isNativeSwap = from.token.address === zeroAddress
	const currentStep = steps[steps.length - 1]

	const isTransactionStage = currentStep?.type === StageType.transaction && currentStep?.status !== Status.SUCCESS
	const isApprovalStage = currentStep?.type === StageType.approve && currentStep?.status !== Status.SUCCESS
	const hasDestinationSwap = selectedRoute?.steps.some((step: any) => step.type === StepType.DST_SWAP)
	const hasSourceSwap = selectedRoute?.steps.some((step: any) => step.type === StepType.SRC_SWAP)

	const { approvalStatus, bridgeStatus, swapStatus, dstSwapStatus } = useSwapStatuses({ steps })

	const time = useTimer(isApprovalStage, isSuccess, isFailed)
	useTransactionCompletion(steps, selectedRoute, swapDispatch)

	const renderButtons: Record<string, JSX.Element> | Record<string, null> = {
		[SwapCardStage.failed]: (
			<div className="gap-lg w-full">
				<Separator />
				<Button isFull={true} onClick={handleGoBack} variant="secondaryColor" size="lg">
					Try again
				</Button>
			</div>
		),
		[SwapCardStage.success]: (
			<>
				<Separator />
				<div className="w-full gap-sm">
					<Button isFull onClick={handleGoBack} variant="secondaryColor" size="lg">
						Swap again
					</Button>
					{isBridge && (
						<Button
							isFull
							variant="secondary"
							size="lg"
							onClick={() => {
								window.open(
									`https://x.com/intent/tweet?text=Just%20performed%20a%20fully%20decentralised%20swap%20from%20%40${
										chainsTwitterMap[swapState.from.chain.id]
									}%20to%20%40${
										chainsTwitterMap[swapState.to.chain.id]
									}%20in%20just%20${time}%20sec%20on%20%40lanca_io!%0A%0ASecured%20by%20%40chainlink%20CCIP%0A%0ATry%20to%20break%20my%20record%20on%20lanca.io%20👇`,
									'_blank',
								)
							}}
						>
							Share on X
						</Button>
					)}
				</div>
			</>
		),
	}

	const stateImages: Record<string, JSX.Element> | Record<string, null> = {
		[SwapCardStage.progress]: (
			<div className={`${classNames.stateImg} ${classNames.stateImgPending}`}>
				<PendingStateSvg />
			</div>
		),
		[SwapCardStage.failed]: (
			<div className={`${classNames.stateImg} ${classNames.stateImgFail}`}>
				<FailStateSvg />
			</div>
		),
		[SwapCardStage.warning]: (
			<div className={`${classNames.stateImg} ${classNames.stateImgFail}`}>
				<FailStateSvg />
			</div>
		),
		[SwapCardStage.success]: (
			<div className={`${classNames.stateImg} ${classNames.stateImgSuccess}`}>
				<SuccessStateSvg />
			</div>
		),
	}

	const title: Record<string, string> | Record<string, null> = {
		[SwapCardStage.progress]: 'Transaction in progress...',
		[SwapCardStage.failed]: 'Transaction failed',
		[SwapCardStage.success]: 'Swap Successful!',
		[SwapCardStage.warning]: 'CCIP Error',
	}

	const secondToLastStep = selectedRoute?.steps?.[selectedRoute.steps.length - 2]
	const lastStep = selectedRoute?.steps?.[selectedRoute.steps.length - 1]

	const isSecondToLastStepActive =
		secondToLastStep &&
		currentStep.txType === secondToLastStep.type &&
		(currentStep.status === Status.PENDING ||
			currentStep.status === Status.SUCCESS ||
			currentStep.status === Status.FAILED)

	const isLastStepActive =
		lastStep &&
		currentStep.txType === lastStep.type &&
		(currentStep.status === Status.PENDING ||
			currentStep.status === Status.SUCCESS ||
			currentStep.status === Status.FAILED)

	const progressContainerClasses = `${classNames.progressContainer} ${
		selectedRoute?.steps?.length! >= 4 && (isSecondToLastStepActive || isLastStepActive)
			? classNames.lastActiveSteps
			: ''
	} ${selectedRoute?.steps?.length! >= 4 ? classNames.moreThanThreeSteps : ''}`

	return (
		<div className={classNames.container}>
			<div className={classNames.header}>
				{(isFailed || isWarning) && (
					<IconButton onClick={handleGoBack} className={classNames.backButton} variant="secondary" size="md">
						<TrailArrowLeftIcon />
					</IconButton>
				)}
				<h3>{title[stage] ?? ''}</h3>
				{isSuccess && (
					<IconButton onClick={handleGoBack} className={classNames.closeButton} variant="secondary" size="md">
						<CrossIcon />
					</IconButton>
				)}
			</div>

			{!isTransactionStage && stateImages[stage]}

			{isSuccess ? (
				<FinishTxInfo time={time} to={to} receivedAmount={currentStep?.receivedAmount} />
			) : (
				<>
					{isTransactionStage && <SwapProgressDetails from={from} to={to} />}
					{!isWarning && (
						<div className={progressContainerClasses}>
							{!isNativeSwap && <TransactionStep status={approvalStatus} title="Approvals" />}
							{!isNativeSwap && <TrailArrowRightIcon color="var(--color-grey-300)" />}
							{hasSourceSwap && (
								<>
									<TransactionStep status={swapStatus} title="Swap" />
								</>
							)}
							{isBridge && hasSourceSwap && <TrailArrowRightIcon color="var(--color-grey-300)" />}
							{isBridge && (
								<>
									<TransactionStep status={bridgeStatus} title="Bridge" />
								</>
							)}
							{isBridge && hasDestinationSwap && <TrailArrowRightIcon color="var(--color-grey-300)" />}
							{isBridge && hasDestinationSwap && (
								<>
									<TransactionStep status={dstSwapStatus} title="Swap" />
								</>
							)}
						</div>
					)}
					{!isWarning && <Separator />}

					{isApprovalStage && (
						<div className={classNames.infoMessage}>
							<div className={classNames.wrapIcon}>
								<PencilIcon />
							</div>
							<h4 className={classNames.messageTitle}>Signature required</h4>
							<p className={classNames.messageSubtitle}>
								Please open your wallet and sign the transaction
							</p>
						</div>
					)}

					{isWarning && (
						<div className="gap-lg">
							<div className="gap-sm">
								<h4 className={classNames.warningTitle}>Funds will arrive in about 20 minutes</h4>
								<p className={classNames.warningMessage}>
									Your funds are safe but it will take a bit longer to complete the transaction.{' '}
								</p>
							</div>
						</div>
					)}

					{currentStep && !isApprovalStage && !isWarning && (
						<Alert
							title={`${currentStep.title}`}
							variant={isFailed ? 'error' : 'neutral'}
							icon={
								isFailed ? <InfoIcon color="var(--color-danger-700)" /> : <Loader variant="neutral" />
							}
						/>
					)}
				</>
			)}

			{renderButtons[stage] ?? null}
		</div>
	)
}
