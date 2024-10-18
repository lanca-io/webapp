import { memo } from 'react'
import { withErrorBoundary } from '../../wrappers/WithErrorBoundary'
import { SwapCard } from '../../cards/SwapCard/SwapCard'
import classNames from './SwapScreen.module.pcss'
import { useSwapReducer } from '../../cards/SwapCard/swapReducer/swapReducer'
import { ErrorCategory, errorTypeMap } from '../../cards/SwapCard/SwapButton/constants'

const Swap = memo(withErrorBoundary(SwapCard))

export const SwapScreen = () => {
	const [swapState, swapDispatch] = useSwapReducer()

	const isInputStageError = swapState.inputError
		? errorTypeMap[swapState.inputError] === ErrorCategory.transaction
		: false

	return (
		<div
			className={`${classNames.container} ${isInputStageError ? classNames.failed : classNames[swapState.stage]}`}
		>
			<Swap swapDispatch={swapDispatch} swapState={swapState} />
		</div>
	)
}
