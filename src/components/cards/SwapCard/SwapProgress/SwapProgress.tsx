import { type Dispatch, type FC, useEffect, useState } from 'react'
import classNames from './SwapProgress.module.pcss'
import { TransactionStep } from '../../../layout/TransactionStep/TransactionStep'
import { StageType, type SwapAction, SwapCardStage, type SwapState } from '../swapReducer/types'
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

interface SwapProgressProps {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
	handleGoBack: () => void
	txInfo?: { duration: number; hash: string } | undefined
}

const chainsTwitterMap: Record<string, string> = {
	[arbitrum.id]: 'arbitrum',
	[base.id]: 'base',
	[polygon.id]: '0xPolygon',
	[avalanche.id]: 'avax',
}

export const SwapProgress: FC<SwapProgressProps> = ({ swapState, handleGoBack, txInfo }) => {
	const [time, setTime] = useState(0)
	const { to, from, steps, stage } = swapState

	const isBridge = to.chain.id !== from.chain.id
	const isFailed = stage === SwapCardStage.failed
	const isSuccess = stage === SwapCardStage.success
	const currentStep = steps[steps.length - 1]
	const isTransactionStage = currentStep?.type === StageType.transaction
	const isAwait = currentStep && currentStep.status === 'await'

	useEffect(() => {
		const timerId = setInterval(() => {
			if (isAwait || isSuccess || isFailed) return

			setTime(prev => prev + 1)
		}, 1000)

		if (isSuccess || isAwait || isFailed) {
			clearInterval(timerId)
		}

		return () => {
			clearInterval(timerId)
		}
	}, [swapState])

	const txType = isBridge ? 'Bridge' : 'Swap'

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
					<Button
						isFull
						variant="secondary"
						size="lg"
						onClick={() => {
							window.open(
								`https://x.com/intent/tweet?text=Just%20performed%20a%20fully%20decentralised%20swap%20from%20%40${chainsTwitterMap[swapState.from.chain.id]}%20to%20%40${chainsTwitterMap[swapState.to.chain.id]}%20in%20just%20${time}%20sec%20on%20%40lanca_io%20testnet!%0A%0ASecured%20by%20%40chainlink%20CCIP%0A%0ATry%20to%20break%20my%20record%20on%20lanca.io%20👇`,
								'_blank',
							)
						}}
					>
						Share on X
					</Button>
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
	}

	const progressDetails = (
		<>
			{isTransactionStage && <SwapProgressDetails from={from} to={to} />}

			<div className={classNames.progressContainer}>
				<TransactionStep status={steps[0]?.status} title="Approvals" />

				{isBridge && (
					<>
						<TrailArrowRightIcon />
						<TransactionStep status={steps[1]?.status} title="Bridge" />
						<TrailArrowRightIcon />
						<TransactionStep status={steps[1]?.status === 'success' ? 'success' : 'idle'} title="Swap" />
					</>
				)}

				{!isBridge && (
					<>
						<TrailArrowRightIcon />
						<TransactionStep status={steps[1]?.status} title="Swap" />
					</>
				)}
			</div>

			<Separator />

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
					title={`${isTransactionStage ? `${txType} ` : ''} ${currentStep.title}`}
					variant={isFailed ? 'error' : 'neutral'}
					icon={isFailed ? <InfoIcon color="var(--color-danger-700)" /> : <Loader variant="neutral" />}
				/>
			)}
		</>
	)

	return (
		<div className={classNames.container}>
			<div className={classNames.header}>
				{isFailed && (
					<IconButton onClick={handleGoBack} className={classNames.backButton} variant="secondary" size="md">
						<TrailArrowLeftIcon />
					</IconButton>
				)}
				<h3>{title[stage] ?? 'Uh Oh...'}</h3>
				{isSuccess && (
					<IconButton onClick={handleGoBack} className={classNames.closeButton} variant="secondary" size="md">
						<CrossIcon />
					</IconButton>
				)}
			</div>

			{!isTransactionStage && stateImages[stage]}

			{isSuccess ? <FinishTxInfo time={time} to={to} /> : progressDetails}

			{renderButtons[stage] ?? null}
		</div>
	)
}
