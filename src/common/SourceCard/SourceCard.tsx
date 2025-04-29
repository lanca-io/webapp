import type { FC } from 'react'
import { useMemo } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { useFormStore } from '../../store/form/useFormStore'
import { useModalsStore } from '../../store/modals/useModalsStore'
import { SourcePanel } from '../SourcePanel/SourcePanel'
import './SourceCard.pcss'

export const SourceCard: FC = () => {
	const { sourceToken, sourceChain } = useFormStore()
	const { openFromAssetModal } = useModalsStore()

	const assetSelection = useMemo(
		() => <AssetSelection token={sourceToken} chain={sourceChain} openModal={openFromAssetModal} />,
		[sourceToken, sourceChain, openFromAssetModal],
	)

	const sourceSection = useMemo(() => <SourcePanel />, [])

	return (
		<div className="source_card">
			{assetSelection}
			{sourceSection}
		</div>
	)
}
