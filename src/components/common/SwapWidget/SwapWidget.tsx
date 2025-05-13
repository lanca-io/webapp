import { FC, useMemo, memo } from 'react'
import { SourceCard } from '../SourceCard/SourceCard'
import { DestinationCard } from '../DestinationCard/DestinationCard'
import { CardSwitcher } from '../CardSwitcher/CardSwitcher'
import { SwapAction } from '../SwapAction/SwapAction'
import { ProcessCard } from '../ProcessCard/ProcessCard'
import { useTxExecutionStore } from '../../../store/tx-execution/useTxExecutionStore'
import './SwapWidget.pcss'

export const SwapWidget: FC = memo(() => {
	const { overallStatus } = useTxExecutionStore()

	const Card = useMemo(() => {
		switch (overallStatus) {
			case 'PENDING':
			case 'SUCCESS':
			case 'REJECTED':
			case 'FAILED':
				return <ProcessCard />
			default:
				return (
					<>
						<SourceCard />
						<CardSwitcher />
						<DestinationCard />
						<SwapAction />
					</>
				)
		}
	}, [overallStatus])

	return (
		<div className="swap_container" data-testid="swap-widget">
			{Card}
		</div>
	)
})
