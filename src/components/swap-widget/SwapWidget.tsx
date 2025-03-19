import type { FC } from 'react'
import classNames from './SwapWidget.module.pcss'
import { ModeMenu } from './ModeMenu/ModeMenu'
import { SourceCard } from './SourceCard/SourceCard'
import { DestinationCard } from './DestinationCard/DestinationCard'
import { CardSwitcher } from './CardSwitcher/CardSwitcher'
import { useFormStore } from '../../store/form/useFormStore'

export const SwapWidget: FC = () => {
	const { srcToken } = useFormStore()

	return (
		<div className={classNames['widget-container']}>
			<ModeMenu />
			<div className={classNames['widget']}>
				<SourceCard token={srcToken} />
				<CardSwitcher />
				<DestinationCard />
			</div>
		</div>
	)
}
