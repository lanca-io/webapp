import { memo, useMemo } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { useFormStore } from '../../../store/form/useFormStore'
import { useModalsStore } from '../../../store/modals/useModalsStore'
import { DestinationPanel } from '../DestinationPanel/DestinationPanel'
import { useRouteStore } from '../../../store/route/useRouteStore'
import { formatTokenAmount } from '../../../utils/new/tokens'
import { useSubvariantStore } from '../../../store/subvariant/useSubvariantStore'
import { RouteTimer } from '../RouteTimer/RouteTimer'
import { SplitSubvariantType } from '../../../store/subvariant/types'
import './DestinationCard.pcss'

export const DestinationCard = memo(() => {
	const { route, isLoading } = useRouteStore()
	const { state } = useSubvariantStore()
	const { destinationToken, destinationChain } = useFormStore()
	const { openToAssetModal } = useModalsStore()

	const amount = useMemo(() => {
		if (!route?.to?.amount) return ''
		return destinationToken?.decimals
			? formatTokenAmount(route.to.amount, destinationToken.decimals)
			: route.to.amount
	}, [route?.to?.amount, destinationToken?.decimals])

	return (
		<div className="destination_card_wrapper">
			<div
				className="destination_card"
				style={{ paddingBottom: state === SplitSubvariantType.SEND && route ? '32px' : '16px' }}
			>
				<RouteTimer />
				<AssetSelection token={destinationToken} chain={destinationChain} openModal={openToAssetModal} />
				<DestinationPanel amount={amount || '0'} isLoading={isLoading} />
			</div>
		</div>
	)
})
