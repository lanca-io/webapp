import { FC, useMemo, memo } from 'react'
import { SourceCard } from '../SourceCard/SourceCard'
import { DestinationCard } from '../DestinationCard/DestinationCard'
import { CardSwitcher } from '../CardSwitcher/CardSwitcher'
import { SwapAction } from '../SwapAction/SwapAction'
import { ProcessCard } from '../ProcessCard/ProcessCard'
import { useTxProcess } from '../../../hooks/useTxProcess'
import { ModeMenu } from '../ModeMenu/ModeMenu'
import './SwapWidget.pcss'

export const SwapWidget: FC = memo(() => {
	const { txStatus } = useTxProcess()

	const Card = useMemo(() => {
		switch (txStatus) {
			case 'PENDING':
			case 'SUCCESS':
			case 'REJECTED':
			case 'FAILED':
				return <ProcessCard />
			default:
				return (
					<>
						<ModeMenu />
						<SourceCard />
						<CardSwitcher />
						<DestinationCard />
						<SwapAction />
					</>
				)
		}
	}, [txStatus])

	return (
		<div className="swap_container" data-testid="swap-widget">
			{Card}
		</div>
	)
})
