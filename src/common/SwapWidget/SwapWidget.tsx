import type { FC } from 'react'
import { useMemo } from 'react'
import { ModeMenu } from '../../common/ModeMenu/ModeMenu'
import { SourceCard } from '../../common/SourceCard/SourceCard'
import { CardSwitcher } from '../../common/CardSwitcher/CardSwitcher'
import { DestinationCard } from '../../common/DestinationCard/DestinationCard'
import { ModalManager } from '../../common/ModalManager/ModalManager'
import './SwapWidget.pcss'
import { SwapAction } from '../SwapAction/SwapAction'

export const SwapWidget: FC = () => {
	const modeMenu = useMemo(() => <ModeMenu />, [])
	const sourceCard = useMemo(() => <SourceCard />, [])
	const cardSwitcher = useMemo(() => <CardSwitcher />, [])
	const destinationCard = useMemo(() => <DestinationCard />, [])
	const modalManager = useMemo(() => <ModalManager />, [])
	const swapAction = useMemo(() => <SwapAction />, [])

	return (
		<>
			<div className="swap_container">
				{modeMenu}
				<div className="swap">
					{sourceCard}
					{cardSwitcher}
					{destinationCard}
					{swapAction}
				</div>
			</div>
			{modalManager}
		</>
	)
}
