import React, { useState } from 'react'
import classNames from './SwapWidget.module.pcss'
import { AssetsModal } from './AssetModal/AssetModal'

export const SwapWidget: React.FC = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)

	const toggleModal = () => {
		setIsModalOpen(!isModalOpen)
	}

	const handleClose = () => {
		setIsModalOpen(false)
	}

	return (
		<>
			<button onClick={toggleModal} className={classNames['open-modal-button']}>
				Open Modal
			</button>
			<AssetsModal isOpen={isModalOpen} onClose={handleClose} />
		</>
	)
}
