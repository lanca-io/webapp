import type { FC } from 'react'
import classNames from './SwapWidget.module.pcss'
import { ModeMenu } from './ModeMenu/ModeMenu'
import { SourceCard } from './SourceCard/SourceCard'
import { DestinationCard } from './DestinationCard/DestinationCard'
import { CardSwitcher } from './CardSwitcher/CardSwitcher'

export const SwapWidget: FC = () => {
	return (
		<div className={classNames['widget-container']}>
			<ModeMenu />
			<div className={classNames['widget']}>
				<SourceCard />
				<CardSwitcher />
				<DestinationCard />
			</div>
		</div>
	)
}
