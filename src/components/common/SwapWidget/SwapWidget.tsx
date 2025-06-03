import { FC, useMemo, memo } from 'react'
import { SplitSubvariantType } from '../../../store/subvariant/types'
import { SourceCard } from '../SourceCard/SourceCard'
import { DestinationCard } from '../DestinationCard/DestinationCard'
import { CardSwitcher } from '../CardSwitcher/CardSwitcher'
import { SwapAction } from '../SwapAction/SwapAction'
import { CardPointer } from '../CardPointer/CardPointer'
import { ProcessCard } from '../ProcessCard/ProcessCard'
import { useTxProcess } from '../../../hooks/useTxProcess'
import { ModeMenu } from '../ModeMenu/ModeMenu'
import { AddressCard } from '../AddressCard/AddressCard'
import { Status } from '@lanca/sdk'
import { RewardsWidget } from '../RewardsWidget/RewardsWidget'
import { useSubvariantStore } from '../../../store/subvariant/useSubvariantStore'
import './SwapWidget.pcss'

export const SwapWidget: FC = memo(() => {
	const { txStatus } = useTxProcess()
	const { state } = useSubvariantStore()

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
						{state === SplitSubvariantType.SEND && (
							<>
								<CardPointer />
								<AddressCard />
							</>
						)}
						<SwapAction />
					</>
				)
		}
	}, [txStatus, state])

	return (
		<div className={`swap_container`} data-testid="swap-widget">
			{Card}
			{txStatus === Status.SUCCESS && <RewardsWidget />}
		</div>
	)
})
