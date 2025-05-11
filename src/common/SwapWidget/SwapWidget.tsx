import { memo } from 'react'
import { ModeMenu } from '../../common/ModeMenu/ModeMenu'
import { SourceCard } from '../../common/SourceCard/SourceCard'
import { CardSwitcher } from '../../common/CardSwitcher/CardSwitcher'
import { DestinationCard } from '../../common/DestinationCard/DestinationCard'
import { ModalManager } from '../../common/ModalManager/ModalManager'
import { SwapAction } from '../SwapAction/SwapAction'
import './SwapWidget.pcss'

export const SwapWidget = memo(
	(): JSX.Element => (
		<>
			<div className="swap_container" role="main" aria-label="Swap interface">
				<ModeMenu />
				<div className="swap">
					<SourceCard />
					<CardSwitcher />
					<DestinationCard />
					<SwapAction />
				</div>
			</div>
			<ModalManager />
		</>
	),
)
