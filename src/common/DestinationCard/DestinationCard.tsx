import { FC, memo } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { useFormStore } from '../../store/form/useFormStore'
import { useModalsStore } from '../../store/modals/useModalsStore'
import './DestinationCard.pcss'

export const DestinationCard: FC = memo(() => {
	const { destinationToken, destinationChain } = useFormStore()
	const { openToAssetModal } = useModalsStore()

	return (
		<div className="destination_card">
			<AssetSelection token={destinationToken} chain={destinationChain} openModal={openToAssetModal} />
		</div>
	)
})
