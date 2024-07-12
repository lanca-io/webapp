import { memo } from 'react'
import { withErrorBoundary } from '../../wrappers/WithErrorBoundary'
import { SwapCard } from '../../cards/SwapCard/SwapCard'
import classNames from './SwapScreen.module.pcss'

const Swap = memo(withErrorBoundary(SwapCard))

export const SwapScreen = () => {
	const newSwapScreenLayout = (
		<div className={classNames.newSwapCardContainer}>
			<div className={classNames.newSwapCardInnerContainer}>
				<Swap />
			</div>
		</div>
	)

	return <div className={classNames.newSwapScreenContainer}>{newSwapScreenLayout}</div>
}
