import { type ReactElement } from 'react'
import SwapSection from './components/SwapSection/SwapSection'
import DividerSection from './components/DividerSection/DividerSection'
import './SwapWidget.pcss'

const SwapWidget = (): ReactElement => {
	return (
		<div className="swap_widget">
			<div className="swap_widget__container">
				<div className="swap_widget__content">
					<SwapSection heading="You pay" />
					<DividerSection action={() => {}} />
					<SwapSection heading="You receive" />
				</div>
			</div>
		</div>
	)
}

export default SwapWidget
