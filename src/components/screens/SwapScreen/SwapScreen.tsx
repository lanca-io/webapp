import { memo } from 'react'
import { withErrorBoundary } from '../../wrappers/WithErrorBoundary'
import { SwapCard } from '../../cards/SwapCard/SwapCard'
import classNames from './SwapScreen.module.pcss'
import { useSwapReducer } from '../../cards/SwapCard/swapReducer/swapReducer'

const Swap = memo(withErrorBoundary(SwapCard))

export const SwapScreen = () => {
	const [swapState, swapDispatch] = useSwapReducer()

	return (
		<div className={`${classNames.container} ${classNames[swapState.stage]}`}>
			<Swap swapDispatch={swapDispatch} swapState={swapState} />
		</div>
	)
}
