import type { FC } from 'react'
import { useMemo } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { useFormStore } from '../../store/form/useFormStore'
import { useModalsStore } from '../../store/modals/useModalsStore'
import './SourceCard.pcss'

export const SourceCard: FC = () => {
	const { sourceToken, sourceChain } = useFormStore()
	const { openFromAssetModal } = useModalsStore()

	const assetSelection = useMemo(
		() => <AssetSelection token={sourceToken} chain={sourceChain} openModal={openFromAssetModal} />,
		[sourceToken, sourceChain, openFromAssetModal],
	)

	return <div className="source_card">{assetSelection}</div>
}
