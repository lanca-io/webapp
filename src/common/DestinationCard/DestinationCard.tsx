import type { FC } from 'react'
import { useMemo } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { useFormStore } from '../../store/form/useFormStore'
import { useModalsStore } from '../../store/modals/useModalsStore'
import './DestinationCard.pcss'

export const DestinationCard: FC = () => {
	const { destinationToken, destinationChain } = useFormStore()
	const { openToAssetModal } = useModalsStore()

	const assetSelection = useMemo(
		() => <AssetSelection token={destinationToken} chain={destinationChain} openModal={openToAssetModal} />,
		[destinationToken, destinationChain, openToAssetModal],
	)

	return <div className="destination_card">{assetSelection}</div>
}

DestinationCard.displayName = 'DestinationCard'
