import { memo, useMemo } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { useFormStore } from '../../../store/form/useFormStore'
import { useModalsStore } from '../../../store/modals/useModalsStore'
import { DestinationPanel } from '../DestinationPanel/DestinationPanel'
import { useRouteStore } from '../../../store/route/useRouteStore'
import { formatTokenAmount } from '../../../utils/new/tokens'
import { RouteTimer } from '../RouteTimer/RouteTimer'
import './DestinationCard.pcss'

export const DestinationCard = memo(() => {
	const { route, isLoading } = useRouteStore()
	const { destinationToken, destinationChain } = useFormStore()
	const { openToAssetModal } = useModalsStore()

	const amount = useMemo(() => {
		if (!route?.to?.amount) return ''
		return destinationToken?.decimals
			? formatTokenAmount(route.to.amount, destinationToken.decimals)
			: route.to.amount
	}, [route?.to?.amount, destinationToken?.decimals])

	return (
		<div className="destination_card">
			<RouteTimer />
			<AssetSelection token={destinationToken} chain={destinationChain} openModal={openToAssetModal} />
			<DestinationPanel amount={amount || '0'} isLoading={isLoading} />
		</div>
	)
})
