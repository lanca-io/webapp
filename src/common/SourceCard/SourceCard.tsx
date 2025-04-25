import { FC, memo } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { useFormStore } from '../../store/form/useFormStore'
import { useModalsStore } from '../../store/modals/useModalsStore'
import './SourceCard.pcss'

export const SourceCard: FC = memo(() => {
	const { sourceToken, sourceChain } = useFormStore()
	const { openFromAssetModal } = useModalsStore()

	return (
		<div className="source_card">
			<AssetSelection token={sourceToken} chain={sourceChain} openModal={openFromAssetModal} />
		</div>
	)
})
