import type { FC } from 'react'
import type { SourceCardProps } from './types'
import { useState } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { AssetsModal } from '../AssetModal/AssetModal'
import { AmountPanel } from '../AmountPanel/AmountPanel'
import classNames from './SourceCard.module.pcss'

export const SourceCard: FC<SourceCardProps> = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false)

	const openModal = () => setModalOpen(true)
	const closeModal = () => setModalOpen(false)

	return (
		<>
			<div className={classNames['source-card']}>
				<AssetSelection direction="from" openModal={openModal} />
				<AmountPanel />
			</div>
			{modalOpen && <AssetsModal isOpen={modalOpen} direction="from" onClose={closeModal} />}
		</>
	)
}
