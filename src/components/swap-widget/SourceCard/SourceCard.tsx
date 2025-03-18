import type { FC } from 'react'
import { useState } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { AssetsModal } from '../AssetModal/AssetModal'
import classNames from './SourceCard.module.pcss'

export const SourceCard: FC = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false)

	const openModal = () => setModalOpen(true)
	const closeModal = () => setModalOpen(false)

	return (
		<>
			<div className={classNames['source-card']}>
				<AssetSelection direction="from" openModal={openModal} />
			</div>
			{modalOpen && <AssetsModal isOpen={modalOpen} direction="from" onClose={closeModal} />}
		</>
	)
}
