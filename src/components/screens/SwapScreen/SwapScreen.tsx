import { memo } from 'react'
import { withErrorBoundary } from '../../wrappers/WithErrorBoundary'
import { SwapCard } from '../../cards/SwapCard/SwapCard'
import classNames from './SwapScreen.module.pcss'

const Swap = memo(withErrorBoundary(SwapCard))

export const SwapScreen = () => {
	return (
		<div className={classNames.container}>
			<Swap />
		</div>
	)
}
