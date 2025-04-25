import type { FC } from 'react'
import { ModeMenu } from '../../common/ModeMenu/ModeMenu'
import { SourceCard } from '../../common/SourceCard/SourceCard'
import { DestinationCard } from '../../common/DestinationCard/DestinationCard'
import { ModalManager } from '../../common/ModalManager/ModalManager'
import './Swap.pcss'

export const Swap: FC = () => {
	return (
		<>
			<div className="swap_container">
				<ModeMenu />
				<div className="swap">
					<SourceCard />
					<DestinationCard />
				</div>
			</div>
			<ModalManager />
		</>
	)
}
