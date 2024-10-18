import { type Dispatch, useRef, useState } from 'react'
import classNames from './SwapCard.module.pcss'
import { useSwapCardEffects } from './SwapCardEffects'
import { SwapInput } from './SwapInput/SwapInput'
import { SwapProgress } from './SwapProgress/SwapProgress'
import { type SwapAction, SwapCardStage, type SwapState } from './swapReducer/types'
import { Card } from '../Card/Card'

export interface Props {
	swapState: SwapState
	swapDispatch: Dispatch<SwapAction>
}

export const SwapCard = ({ swapState, swapDispatch }: Props) => {
	const [txInfo, setTxInfo] = useState<{ duration: number; hash: string } | undefined>(undefined)
	const typingTimeoutRef = useRef<number>()

	const isInputStages = swapState.stage === SwapCardStage.input || swapState.stage === SwapCardStage.review

	useSwapCardEffects({ swapState, swapDispatch, typingTimeoutRef })

	const handleGoBack = () => {
		swapDispatch({ type: 'RESET_AMOUNTS', direction: 'from' })
		swapDispatch({ type: 'RESET_AMOUNTS', direction: 'to' })
		swapDispatch({ type: 'CLEAR_ROUTES' })
		swapDispatch({ type: 'SET_SWAP_STAGE', payload: SwapCardStage.input })
		swapDispatch({ type: 'SET_SWAP_STEPS', payload: [] })
	}

	return (
		<Card className={classNames.container}>
			{isInputStages ? (
				<SwapInput swapState={swapState} swapDispatch={swapDispatch} setTxInfo={setTxInfo} />
			) : (
				<SwapProgress
					swapState={swapState}
					handleGoBack={handleGoBack}
					swapDispatch={swapDispatch}
					txInfo={txInfo}
				/>
			)}
		</Card>
	)
}
