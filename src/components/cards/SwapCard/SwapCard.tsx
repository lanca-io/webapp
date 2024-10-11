import { type Dispatch, type ReactComponentElement, useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import classNames from './SwapCard.module.pcss'
import { useSwapCardEffects } from './SwapCardEffects'
import { SwapInput } from './SwapInput/SwapInput'
import { SwapProgress } from './SwapProgress/SwapProgress'
import { type SwapAction, SwapCardStage, type SwapState } from './swapReducer/types'
import { ContactSupportCard } from '../ContactSupportCard/ContactSupportCard'
import posthog from 'posthog-js'
import { Card } from '../Card/Card'

export interface Props {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
}

export const SwapCard = ({ swapState, swapDispatch }: Props) => {
	const [txInfo, setTxInfo] = useState<{ duration: number; hash: string } | undefined>(undefined)
	const { address, connector } = useAccount()
	const typingTimeoutRef = useRef<number>()

	const handleGoBack = () => {
		swapDispatch({ type: 'RESET_AMOUNTS', direction: 'from' })
		swapDispatch({ type: 'RESET_AMOUNTS', direction: 'to' })
		swapDispatch({ type: 'CLEAR_ROUTES' })
		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.input })
		swapDispatch({ type: 'SET_SWAP_STEPS', payload: [] })
	}

	function handleContactSupportGoBackClick() {
		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.failed })
	}

	const infoToCopy = {
		...swapState.selectedRoute,
		replay_id: posthog.get_distinct_id(),
		session_id: posthog.get_session_id(),
	}

	const renderSwapStage: Record<SwapCardStage, ReactComponentElement<any>> = {
		[SwapCardStage.input]: <SwapInput swapState={swapState} swapDispatch={swapDispatch} setTxInfo={setTxInfo} />,
		[SwapCardStage.review]: <SwapInput swapState={swapState} swapDispatch={swapDispatch} setTxInfo={setTxInfo} />,
		[SwapCardStage.progress]: (
			<SwapProgress
				swapState={swapState}
				handleGoBack={handleGoBack}
				swapDispatch={swapDispatch}
				txDuration={txInfo}
			/>
		),
		[SwapCardStage.success]: (
			<SwapProgress
				swapState={swapState}
				handleGoBack={handleGoBack}
				swapDispatch={swapDispatch}
				txInfo={txInfo}
			/>
		),
		[SwapCardStage.failed]: (
			<SwapProgress
				swapState={swapState}
				handleGoBack={handleGoBack}
				swapDispatch={swapDispatch}
				txInfo={txInfo}
			/>
		),
		[SwapCardStage.contactSupport]: (
			<ContactSupportCard handleGoBackClick={handleContactSupportGoBackClick} infoToCopy={infoToCopy} />
		),
	}

	useSwapCardEffects({ swapState, swapDispatch, address, typingTimeoutRef, connector })

	return <Card className={classNames.container}>{renderSwapStage[swapState.stage]}</Card>
}
