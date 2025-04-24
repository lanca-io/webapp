import type { FC } from 'react'
import { ModeMenu } from '../../common/ModeMenu/ModeMenu'
import { SourceCard } from './SourceCard/SourceCard'
import { DestinationCard } from './DestinationCard/DestinationCard'
import './Swap.pcss'

export const Swap: FC = () => {
	return (
		<div className="swap_container">
			<ModeMenu />
			<div className="swap">
				<SourceCard />
				<DestinationCard />
			</div>
		</div>
	)
}
