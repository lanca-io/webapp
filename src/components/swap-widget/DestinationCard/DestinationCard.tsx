import type { FC } from 'react'
import { useState } from 'react'
import { AssetSelection } from '../AssetSelection/AssetSelection'
import { AssetsModal } from '../AssetModal/AssetModal'
import classNames from './DestinationCard.module.pcss'
import { DestinationAmount } from '../DestinationAmount.tsx/DestinationAmount'

export const DestinationCard: FC = () => {
	const [modalOpen, setModalOpen] = useState<boolean>(false)

	const openModal = () => setModalOpen(true)
	const closeModal = () => setModalOpen(false)

	return (
		<>
			<div className={classNames['destination-card']}>
				<AssetSelection direction="to" openModal={openModal} />
				<DestinationAmount />
			</div>
			{modalOpen && <AssetsModal isOpen={modalOpen} direction="to" onClose={closeModal} />}
		</>
	)
}
