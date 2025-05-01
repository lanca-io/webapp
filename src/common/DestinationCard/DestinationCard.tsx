import type { FC } from 'react'
import { useMemo } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { useFormStore } from '../../store/form/useFormStore'
import { useModalsStore } from '../../store/modals/useModalsStore'
import { DestinationPanel } from '../DestinationPanel/DestinationPanel'
import { useRouteStore } from '../../store/route/useRouteStore'
import './DestinationCard.pcss'

export const DestinationCard: FC = () => {
	const { route, isLoading } = useRouteStore()
	const { destinationToken, destinationChain } = useFormStore()
	const { openToAssetModal } = useModalsStore()

	const assetSelection = useMemo(
		() => <AssetSelection token={destinationToken} chain={destinationChain} openModal={openToAssetModal} />,
		[destinationToken, destinationChain, openToAssetModal],
	)

	const destinationPanel = useMemo(
		() => <DestinationPanel amount={route?.to?.amount || ''} isLoading={isLoading} />,
		[route?.to?.amount, isLoading],
	)

	return (
		<div className="destination_card">
			{assetSelection}
			{destinationPanel}
		</div>
	)
}
