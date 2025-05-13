import { memo } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { useFormStore } from '../../../store/form/useFormStore'
import { useModalsStore } from '../../../store/modals/useModalsStore'
import { SourcePanel } from '../SourcePanel/SourcePanel'
import './SourceCard.pcss'

export const SourceCard = memo((): JSX.Element => {
	const { sourceToken, sourceChain } = useFormStore()
	const { openFromAssetModal } = useModalsStore()

	return (
		<div className="source_card" role="region" aria-label="Source asset selection">
			<AssetSelection token={sourceToken} chain={sourceChain} openModal={openFromAssetModal} />
			<SourcePanel />
		</div>
	)
})
