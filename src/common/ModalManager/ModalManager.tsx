import type { FC } from 'react'
import { useMemo } from 'react'
import { AssetsModal } from '../AssetModal/AssetModal'
import { useModalsStore } from '../../store/modals/useModalsStore'
import { useAssetModals } from '../../hooks/useAssetModals'

export const ModalManager: FC = () => {
	const { isFromAssetModalOpen, isToAssetModalOpen, closeFromAssetModal, closeToAssetModal } = useModalsStore()
	const { fromChain, toChain, selectFromChain, selectToChain, selectFromAsset, selectToAsset } = useAssetModals()

	const fromAssetModal = useMemo(
		() =>
			isFromAssetModalOpen ? (
				<AssetsModal
					isOpen={isFromAssetModalOpen}
					onClose={closeFromAssetModal}
					onSelect={selectFromAsset}
					onChainSelect={selectFromChain}
					selectedChain={fromChain}
				/>
			) : null,
		[isFromAssetModalOpen, closeFromAssetModal, selectFromAsset, selectFromChain, fromChain],
	)

	const toAssetModal = useMemo(
		() =>
			isToAssetModalOpen ? (
				<AssetsModal
					isOpen={isToAssetModalOpen}
					onClose={closeToAssetModal}
					onSelect={selectToAsset}
					onChainSelect={selectToChain}
					selectedChain={toChain}
				/>
			) : null,
		[isToAssetModalOpen, closeToAssetModal, selectToAsset, selectToChain, toChain],
	)

	return (
		<>
			{fromAssetModal}
			{toAssetModal}
		</>
	)
}
