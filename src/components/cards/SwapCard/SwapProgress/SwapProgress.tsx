import { type Dispatch, type FC } from 'react'
import { IconArrowLeft, IconBrandTwitter, IconUser } from '@tabler/icons-react'
import classNames from './SwapProgress.module.pcss'
import { TokenInfo } from './TokenInfo'
import { TransactionStep } from '../../../layout/TransactionStep/TransactionStep'
import { type SwapAction, SwapCardStage, type SwapState } from '../swapReducer/types'
import { Button } from '../../../layout/buttons/Button/Button'
import { type IStep } from '../../EarnHeaderCard/ManageModal/useEarnReducer/types'
import { useTranslation } from 'react-i18next'
import { PendingStateSvg } from '../../../../assets/images/transactionStates/PendingStateSvg'
import { Separator } from '../../../layout/Separator/Separator'
import { Alert } from '../../../layout/Alert/Alert'
import { Loader } from '../../../layout/Loader/Loader'
import { TrailArrowRightIcon } from '../../../../assets/icons/TrailArrowRightIcon'

interface SwapProgressProps {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
	handleGoBack: () => void
	txInfo: { duration: number; hash: string } | undefined
}

const testnetChainsTwitterMap: Record<string, string> = {
	'421614': 'arbitrum',
	'84532': 'base',
	'11155420': 'Optimism',
}

export const SwapProgress: FC<SwapProgressProps> = ({ swapState, handleGoBack, swapDispatch, txInfo }) => {
	const { from, to, steps, stage } = swapState
	const { t } = useTranslation()

	function handleContactSupportButtonClick() {
		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.contactSupport })
	}

	const renderButtons: Record<string, JSX.Element> | Record<string, null> = {
		[SwapCardStage.failed]: (
			<Button
				leftIcon={<IconArrowLeft size={20} color={'var(--color-pacific-400)'} />}
				onClick={handleGoBack}
				variant="secondary"
			>
				Try again
			</Button>
		),
		[SwapCardStage.success]: (
			<div className={classNames.successButtonsContainer}>
				{swapState.isTestnet && txInfo !== undefined ? (
					<Button
						leftIcon={<IconBrandTwitter size={18} />}
						onClick={() => {
							window.open(
								`https://twitter.com/intent/tweet?text=Just%20performed%20a%20fully%20decentralised%20swap%20from%20%40${testnetChainsTwitterMap[swapState.from.chain.id]}%20to%20%40${testnetChainsTwitterMap[swapState.to.chain.id]}%20in%20just%20${txInfo?.duration}%20sec%20on%20%40concero_io%20testnet!%0A%0ASecured%20by%20%40chainlink%20CCIP%0A%0ATry%20to%20break%20my%20record%20on%20app.concero.io%20👇`,
								'_blank',
							)
						}}
					>
						Share on Twitter
					</Button>
				) : null}
				<Button
					leftIcon={<IconArrowLeft size={20} color={'var(--color-pacific-400)'} />}
					onClick={handleGoBack}
					variant="secondary"
				>
					{t('button.goBack')}
				</Button>
			</div>
		),
	}

	const button = renderButtons[stage] ?? null

	return (
		<div className={classNames.container}>
			<div className={classNames.header}>
				<h3>Transaction in progress...</h3>
			</div>

			<div className={classNames.stateImg}>
				<PendingStateSvg />
			</div>

			<div className={classNames.progressContainer}>
				{steps.map((step: IStep, index: number) => (
					<TransactionStep key={index.toString()} step={step} />
				))}
				<TrailArrowRightIcon />
				<h4>Bridge</h4>
				<TrailArrowRightIcon />
				<h4>Swap</h4>
			</div>

			<Separator />

			<Alert title="Signature required" variant="neutral" icon={<Loader variant="neutral" />} />

			{button}
		</div>
	)
}

// <div className={classNames.tokensInfoContainer}>
// 	<TokenInfo direction={from} />
// 	<TokenInfo direction={to} />
// </div>
