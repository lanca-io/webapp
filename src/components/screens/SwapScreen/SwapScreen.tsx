import { memo, useEffect, useState } from 'react'
import { withErrorBoundary } from '../../wrappers/WithErrorBoundary'
// import { SwapCard } from '../../cards/SwapCard/SwapCard'
import classNames from './SwapScreen.module.pcss'
import { useSwapReducer } from '../../cards/SwapCard/swapReducer/swapReducer'
import { ErrorCategory, errorTypeMap } from '../../cards/SwapCard/SwapButton/constants'
import { getPriceImpact } from '../../cards/SwapCard/SwapDetails/FeeDropdown/getPriceImpact'
import { type SwapCardStage } from '../../cards/SwapCard/swapReducer/types'
import { config } from '../../../constants/config'
import { TechWorksScreen } from '../TechWorksScreen/TechWorksScreen'
import { Footer } from '../../layout/Footer/Footer'
import { SwapWidget } from '../../../common/SwapWidget/SwapWidget'

const Swap = memo(withErrorBoundary(SwapWidget))

export const SwapScreen = () => {
	const [swapState, swapDispatch] = useSwapReducer()
	const [backgroundTheme, setBackgroundTheme] = useState<SwapCardStage | string>(swapState.stage)

	useEffect(() => {
		if (!swapState.selectedRoute) {
			setBackgroundTheme(swapState.stage)
			return
		}

		const { priceImpact, totalFees } = getPriceImpact(swapState.selectedRoute)
		const warningPriceImpact = priceImpact > 10 && totalFees > 5
		const dangerPriceImpact = priceImpact > 20 && totalFees > 5

		if (warningPriceImpact) {
			setBackgroundTheme(dangerPriceImpact ? 'failed' : 'warning')
		} else {
			setBackgroundTheme(swapState.stage)
		}
	}, [swapState.selectedRoute])

	useEffect(() => {
		if (swapState.inputError && errorTypeMap[swapState.inputError] === ErrorCategory.transaction) {
			setBackgroundTheme('failed')
		} else {
			setBackgroundTheme(swapState.stage)
		}
	}, [swapState.inputError])

	if (config.APP_IS_NOT_AVAILABLE) {
		return <TechWorksScreen />
	}

	return (
		<div className={`${classNames.container} ${classNames[backgroundTheme]}`}>
			<Swap swapDispatch={swapDispatch} swapState={swapState} />
			<div className={classNames.footerWrapper}>
				<Footer />
			</div>
		</div>
	)
}
