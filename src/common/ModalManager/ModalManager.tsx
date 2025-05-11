import { memo } from 'react'
import { AssetsModal } from '../AssetModal/AssetModal'
import { useModalsStore } from '../../store/modals/useModalsStore'
import { useAssetModals } from '../../hooks/useAssetModals'

export const ModalManager = memo((): JSX.Element | null => {
	const { isFromAssetModalOpen, isToAssetModalOpen, closeFromAssetModal, closeToAssetModal } = useModalsStore()

	const { fromChain, toChain, selectFromChain, selectToChain, selectFromAsset, selectToAsset } = useAssetModals()

	return (
		<>
			{isFromAssetModalOpen && (
				<AssetsModal
					isOpen={isFromAssetModalOpen}
					onClose={closeFromAssetModal}
					onSelect={selectFromAsset}
					onChainSelect={selectFromChain}
					selectedChain={fromChain}
				/>
			)}

			{isToAssetModalOpen && (
				<AssetsModal
					isOpen={isToAssetModalOpen}
					onClose={closeToAssetModal}
					onSelect={selectToAsset}
					onChainSelect={selectToChain}
					selectedChain={toChain}
				/>
			)}
		</>
	)
})
