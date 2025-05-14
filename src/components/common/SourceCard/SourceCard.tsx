import { memo } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { useFormStore } from '../../../store/form/useFormStore'
import { useModalsStore } from '../../../store/modals/useModalsStore'
import { SourcePanel } from '../SourcePanel/SourcePanel'
import './SourceCard.pcss'

export const SourceCard = memo((): JSX.Element => {
	const { fromToken, fromChain } = useFormStore()
	const { openFromAssetModal } = useModalsStore()

	return (
		<div className="source_card_wrapper">
			<div className="source_card">
				<AssetSelection token={fromToken} chain={fromChain} openModal={openFromAssetModal} />
				<SourcePanel />
			</div>
		</div>
	)
})
